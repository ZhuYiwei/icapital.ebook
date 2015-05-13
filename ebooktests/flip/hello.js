/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

//
// See README for overview
//

'use strict';

//
// Fetch the PDF document from the URL using promises
//
PDFJS.getDocument('2633-withcover.pdf').then(function(pdf) {
  console.log("pdf loaded");
  var loadedPages = 0;

  for(var pageNum = 1; pageNum <= pdf.numPages; pageNum++){
      // Using promise to fetch the page
      pdf.getPage(pageNum).then(function(page) {
        var scale = 0.7;
        var viewport = page.getViewport(scale);

        //
        // Prepare canvas using PDF page dimensions
        //
        var canvas = document.createElement("canvas");
        //var canvas = document.getElementById('the-canvas');
        var context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        //
        // Render PDF page into canvas context
        //
        var renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        page.render(renderContext);
        var div = document.createElement("DIV");
        $(div).append(canvas);
        $("div.flipbook").append(div);

        if (++loadedPages >= pdf.numPages) {
          // $('.flipbook').turn({ width:922, height:600, elevation: 50, gradients: true, autoCenter: true });
        }
      });
  }


});

$("#zoom-viewport").bind("zoom.doubleTap", function(event) {
  if ($(this).zoom("value")==1) {
    $(this).zoom("zoomIn", event);
  } else {
    $(this).zoom("zoomOut");
  }
});
