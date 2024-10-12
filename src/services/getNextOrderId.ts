import Counter from "@/model/counterModel";

export async function getNextOrderId(): Promise<number> {
  const counter = await Counter.findOneAndUpdate(
    { name: "orderCounter" },
    { $inc: { sequenceValue: 1 } },
    { new: true, upsert: true }
  );
  if (counter) {
    return counter.sequenceValue;
  }

  throw new Error("Failed to get the next order ID");
}
