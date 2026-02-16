use anchor_lang::prelude::*;

declare_id!("C1rcu1t111111111111111111111111111111111");

#[program]
pub mod circuit {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        cooldown_seconds: i64,
        payout_amount: u64,
        agent: Pubkey,
    ) -> Result<()> {
        let state = &mut ctx.accounts.circuit_state;
        state.last_trigger_ts = 0;
        state.cooldown_seconds = cooldown_seconds;
        state.payout_amount = payout_amount;
        state.agent = agent;
        Ok(())
    }

    pub fn trigger_payout(ctx: Context<TriggerPayout>) -> Result<()> {
        let state = &mut ctx.accounts.circuit_state;
        let clock = Clock::get()?;

        require!(
            ctx.accounts.agent.key() == state.agent,
            CircuitError::UnauthorizedAgent
        );

        require!(
            clock.unix_timestamp - state.last_trigger_ts >= state.cooldown_seconds,
            CircuitError::CooldownActive
        );

        let recipients = ctx.remaining_accounts.len() as u64;
        let total = state
            .payout_amount
            .checked_mul(recipients)
            .ok_or(CircuitError::Overflow)?;

        require!(
            **ctx.accounts.reserve_vault.lamports.borrow() >= total,
            CircuitError::InsufficientReserve
        );

        for recipient in ctx.remaining_accounts.iter() {
            **ctx.accounts.reserve_vault.try_borrow_mut_lamports()? -= state.payout_amount;
            **recipient.try_borrow_mut_lamports()? += state.payout_amount;
        }

        state.last_trigger_ts = clock.unix_timestamp;

        emit!(CircuitTriggered {
            timestamp: clock.unix_timestamp,
            payout_amount: state.payout_amount,
            recipient_count: recipients,
            cooldown_seconds: state.cooldown_seconds,
            agent: state.agent,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = payer, space = 8 + CircuitState::SIZE)]
    pub circuit_state: Account<'info, CircuitState>,

    #[account(
        init,
        payer = payer,
        seeds = [b"reserve"],
        bump,
        space = 8
    )]
    pub reserve_vault: SystemAccount<'info>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TriggerPayout<'info> {
    #[account(mut)]
    pub circuit_state: Account<'info, CircuitState>,

    #[account(
        mut,
        seeds = [b"reserve"],
        bump
    )]
    pub reserve_vault: SystemAccount<'info>,

    #[account(signer)]
    pub agent: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct CircuitState {
    pub last_trigger_ts: i64,
    pub cooldown_seconds: i64,
    pub payout_amount: u64,
    pub agent: Pubkey,
}

impl CircuitState {
    pub const SIZE: usize = 8 + 8 + 8 + 32;
}

#[event]
pub struct CircuitTriggered {
    pub timestamp: i64,
    pub payout_amount: u64,
    pub recipient_count: u64,
    pub cooldown_seconds: i64,
    pub agent: Pubkey,
}

#[error_code]
pub enum CircuitError {
    #[msg("Cooldown active")]
    CooldownActive,
    #[msg("Insufficient reserve")]
    InsufficientReserve,
    #[msg("Overflow")]
    Overflow,
    #[msg("Unauthorized agent")]
    UnauthorizedAgent,
}
