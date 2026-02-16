import fs from "fs";
import crypto from "crypto";

setInterval(() => {
  const price = Math.random() > 0.6;
  const liquidity = Math.random() > 0.6;
  const activity = Math.random() > 0.6;

  const confidence =
    (Number(price) + Number(liquidity) + Number(activity)) / 3;

  const safetyOracle = confidence <= 1.5 ? "PASS" : "BLOCK";

  const payload = {
    signals: { price, liquidity, activity },
    confidence: Number(confidence.toFixed(2)),
    safetyOracle
  };

  const reasoningHash = crypto
    .createHash("sha256")
    .update(JSON.stringify(payload))
    .digest("hex");

  fs.writeFileSync(
    "app/public/agent_state.json",
    JSON.stringify({ ...payload, reasoningHash }, null, 2)
  );

  console.log("[CIRCUIT] agent state updated");
}, 3000);
