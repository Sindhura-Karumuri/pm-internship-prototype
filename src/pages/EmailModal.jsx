import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function EmailModal({ isOpen, setIsOpen, applicant, subject, body }) {
  // Open email in a new tab
  const openEmailInNewTab = () => {
    const newWindow = window.open("", "_blank", "width=800,height=700,scrollbars=yes");
    newWindow.document.write(`
      <html>
        <head>
          <title>Send Email</title>
          <style>
            body { font-family: sans-serif; padding: 20px; background: #f9fafb; color: #111827; margin:0; }
            h2 { font-size: 1.5rem; margin-bottom: 10px; }
            p { margin: 5px 0; }
            textarea { width: 100%; height: 300px; padding: 12px; border-radius: 12px; border: 1px solid #d1d5db; background: #f3f4f6; color: #111827; resize: vertical; }
            button { padding: 10px 20px; background: linear-gradient(to right, #3b82f6, #6366f1); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 500; transition: 0.3s; }
            button:hover { transform: scale(1.05); }
          </style>
        </head>
        <body>
          <h2>✉️ Send Email</h2>
          <p><strong>To:</strong> ${applicant?.email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <textarea readonly>${body}</textarea>
          <button onclick="window.close()">Close</button>
        </body>
      </html>
    `);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="flex flex-col w-full max-w-2xl h-[80vh] p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 transition">
              <Dialog.Title className="text-lg font-bold text-gray-800 dark:text-gray-100 flex justify-between items-center">
                ✉️ Send Email
                <button
                  onClick={openEmailInNewTab}
                  className="text-sm px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
                >
                  Open in New Tab
                </button>
              </Dialog.Title>

              <div className="mt-4 flex-1 overflow-y-auto space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <p><strong>To:</strong> {applicant?.email}</p>
                <p><strong>Subject:</strong> {subject}</p>
                <textarea
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-teal-500 focus:outline-none transition resize-none"
                  value={body}
                  readOnly
                  style={{ minHeight: "200px" }}
                />
              </div>

              <div className="mt-4 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
