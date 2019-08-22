const Fs = require("fs");
const Path = require("path");
const Util = require("util");
const Puppeteer = require("puppeteer");
const Handlebars = require("handlebars");
const readFile = Util.promisify(Fs.readFile);

class Main {
  async html() {
    try {
      const data = {
        title: "My New Post",
        body: "This is my post!",
        createdAt: new Date()
      };
      const templatePath = Path.resolve("main.html");
      const content = await readFile(templatePath, "utf8");
      // compile and render the template with handlebars
      const template = Handlebars.compile(content);
      console.log("Template Compiled!");
      return template(data);
    } catch (error) {
      console.log("Cannot Compiled HTML Template.");
      process.exit(1);
    }
  }

  async pdf() {
    try {
      const html = await this.html();
      const browser = await Puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(html);
      // await page.goto('https://www.spicemoney.com/', {waitUntil : 'networkidle2'});
      // Puppeteer generates a PDF using the print CSS media. If you want to print with screen CSS
      // await page.emulateMedia("screen");
      console.log("PDF Genrated!");
      const fileName = `${Date.now()}.pdf`;
      await page.pdf({ path: fileName, format: "A4" });
      await browser.close();
      console.log(`${fileName} Saved!`);
    } catch (error) {
      console.log("Cannot Create PDF.");
      process.exit(1);
    }
  }
}

(async () => {
  await new Main().pdf();
  process.exit(0);
})();
