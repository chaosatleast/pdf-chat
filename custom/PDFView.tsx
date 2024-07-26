"use client";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { Document, Page, pdfjs } from "react-pdf";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2Icon, RotateCw, ZoomInIcon, ZoomOutIcon } from "lucide-react";

function PDFView({ url }: { url: string }) {
  // Modify cors
  // Head to google cloud, create cros.json
  // [
  //     {
  //         "origin" :["*"],
  //         "method": ["GET"],
  //         "maxAgeSeconds":3600
  //     }
  // ]
  // gsutil cors set cors.json gs://doc-pal-7adc6.appspot.com

  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

  const [numPages, setNumPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [file, setFile] = useState<Blob | null>();
  const [rotation, setRotation] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    const fetchFile = async () => {
      const response = await fetch(url);
      const file = await response.blob();

      setFile(file);
    };
    fetchFile();
  }, [url]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className=" mx-10 flex flex-col items-center justify-center overflow-y-auto">
      <div className="sticky top-0 z-10">
        <div className="flex gap-x-2 mt-2 items-center">
          <Button
            variant={"default"}
            disabled={currentPage === 1}
            onClick={() => {
              if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
              }
            }}
          >
            Previous
          </Button>
          <div>
            {currentPage} of {numPages} {numPages! > 1 ? "pages" : "page"}
          </div>
          <Button
            disabled={currentPage === numPages}
            variant={"default"}
            onClick={() => {
              if (currentPage < numPages!) {
                setCurrentPage(currentPage + 1);
              }
            }}
          >
            Next
          </Button>
          <Button
            onClick={() => {
              setRotation((rotation + 90) % 360);
            }}
          >
            <RotateCw />
          </Button>
          <Button
            disabled={scale >= 1.5}
            onClick={() => {
              setScale(scale * 1.2);
            }}
          >
            <ZoomInIcon />
          </Button>
          <Button
            disabled={scale <= 0.75}
            onClick={() => {
              setScale(scale / 1.2);
            }}
          >
            <ZoomOutIcon />
          </Button>
        </div>
      </div>

      {!file ? (
        <Loader2Icon className="animate-spin h-20 w-20 mt-20" />
      ) : (
        <Document
          loading={null}
          file={file}
          rotate={rotation}
          onLoadSuccess={onDocumentLoadSuccess}
          className="m-4 overflow-scroll"
        >
          <Page className="shadow-lg" scale={scale} pageNumber={currentPage} />
        </Document>
      )}
    </div>
  );
}

export default PDFView;
