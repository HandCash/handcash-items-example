import { ComponentsFactory } from "../../ComponentsFactory.js";
import { Command, Argument } from "commander";

async function main() {
  const [imagePath] = new Command()
    .addArgument(new Argument('<imagePath>', 'Path to the image you want to upload'))
    .parse(process.argv)
    .args;

  const imageService = ComponentsFactory.getImageService();
  try {
    const result = await imageService.uploadImage(imagePath);
    console.log(`Image uploaded successfully! URL: ${result.imageUrl}`);
  } catch (error) {
    console.error(error);
  }
}

(async () => {
  try {
    await main();
  } catch (e) {
    console.error(e);
  }
})();
