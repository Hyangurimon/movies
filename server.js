// getting-started.js
const mongoose = require("mongoose");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/test");

  const kittySchema = new mongoose.Schema({
    name: String,
  });

  const Kitten = mongoose.model("Kitten", kittySchema);

  const silence = new Kitten({ name: "Silence" });

  await silence.save();

  const kittens = await Kitten.find();
  console.log(kittens);

  const cutie = new Kitten({ name: "Cutie" });

  await cutie.save();
}
