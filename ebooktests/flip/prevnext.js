//
  // If absolute URL from the remote server is provided, configure the CORS
  // header on that server.
  //
  'use strict';
  var url = '2633-withcover.pdf';


  //
  // Disable workers to avoid yet another cross-origin issue (workers need
  // the URL of the script to be loaded, and dynamically loading a cross-origin
  // script does not work).
  //
  // PDFJS.disableWorker = true;

  //
  // In cases when the pdf.worker.js is located at the different folder than the
  // pdf.js's one, or the pdf.js is executed via eval(), the workerSrc property
  // shall be specified.
  //
  // PDFJS.workerSrc = '../../build/pdf.worker.js';

  var pdfDoc = null,
      pageNum = 1,
      pageRendering = false,
      pageNumPending = null,
      scale = 0.8,
      // canvas = document.getElementById('the-canvas'),
      // ctx = canvas.getContext('2d');

  /**
   * Asynchronously downloads PDF.
   */
  PDFJS.getDocument(url).then(function (pdfDoc_) {
    pdfDoc = pdfDoc_;
    document.getElementById('page_count').textContent = pdfDoc.numPages;

    // Initial/first page rendering
    
    for(pageNum; pageNum<= pdfDoc.numPages; pageNum++){
      renderPage(pageNum);
    }
    
  });
  /**
   * Get page info from document, resize canvas accordingly, and render page.
   * @param num Page number.
   */
  function renderPage(num) {
    pageRendering = true;
    // Using promise to fetch the page
    pdfDoc.getPage(num).then(function(page) {
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext('2d');
      var viewport = page.getViewport(scale);
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render PDF page into canvas context
      var renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };
      var renderTask = page.render(renderContext);

      // Wait for rendering to finish
      renderTask.promise.then(function () {
        pageRendering = false;
        if (pageNumPending !== null) {
          // New page rendering is pending
          renderPage(pageNumPending);
          pageNumPending = null;
        }
      });
    });

    // Update page counters
    //document.getElementById('page_num').textContent = pageNum;
    var div = document.createElement("DIV");
    $(div).append(canvas);
    $("div.flipbook").append(div);
  }

  /**
   * If another page rendering in progress, waits until the rendering is
   * finised. Otherwise, executes rendering immediately.
   */
  function queueRenderPage(num) {
    if (pageRendering) {
      pageNumPending = num;
    } else {
      renderPage(num);
    }
  }

  /**
   * Displays previous page.
   */
  function onPrevPage() {
    if (pageNum <= 1) {
      return;
    }
    pageNum--;
    queueRenderPage(pageNum);
  }
  document.getElementById('prev').addEventListener('click', onPrevPage);

  /**
   * Displays next page.
   */
  function onNextPage() {
    if (pageNum >= pdfDoc.numPages) {
      return;
    }
    pageNum++;
    queueRenderPage(pageNum);
  }
  document.getElementById('next').addEventListener('click', onNextPage);

