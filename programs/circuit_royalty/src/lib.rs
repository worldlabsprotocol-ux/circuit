use anchor_lang::prelude::*;

declare_id!("7mNDd4MkKv3PthhMm2yzZ2M9To9mCK39pddnroyTJrPM");

#[program]
pub mod circuit_royalty {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
