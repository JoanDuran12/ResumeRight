import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";

export const downloadElementAsPDF = (
  element: HTMLElement,
  fileName: string = "download.pdf"
) => {
  htmlToImage
    .toPng(element)
    .then((dataUrl) => {
      const pdf = new jsPDF();
    pdf.addImage(dataUrl, "PNG", 0, -1, 210, 300);
      pdf.save(fileName);
    })
    .catch((error) => {
      console.error("oops, something went wrong!", error);
    });
};
