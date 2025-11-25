function descargarPDF(url) {
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "cv.pdf");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default {descargarPDF}