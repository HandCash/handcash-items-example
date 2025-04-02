import { HandCashMinter } from "@handcash/handcash-connect";
import { ComponentsFactory } from "../../../ComponentsFactory.js";
import { Argument, Command } from "commander";


const handCashMinter: HandCashMinter = ComponentsFactory.getHandCashMinter();
const itemsLoader = ComponentsFactory.getItemsLoader();

async function main() {
  const [collectionId] = new Command()
    .addArgument(new Argument('<collectionId>', 'The id of the collection where the items will be minted'))
    .parse(process.argv)
    .args;

  const items = await itemsLoader.loadItems();
  for (const item of items) {
    await handCashMinter.createItemsOrder({ collectionId, items: [item] });
    console.log('Item created', item.name, item.attributes[1].value);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  console.log('All items inscribed');
}

(async () => {
  try {
    await main();
  } catch (e) {
    console.error(e)
  }
})();


