/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

const Footer = () => {
    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-3 z-50 text-neutral-300 text-xs sm:text-sm border-t border-white/10">
            <div className="max-w-screen-xl mx-auto flex justify-end items-center gap-4 px-4">
                <div className="flex items-center gap-4 sm:gap-6">
                    <a
                        href="https://www.instagram.com/ajeetbr21?igsh=Z2NzNmRzZXpjNjRt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-permanent-marker text-sm sm:text-base text-center text-black bg-yellow-400 py-2 px-4 rounded-sm transform transition-transform duration-200 hover:scale-105 hover:-rotate-2 hover:bg-yellow-300 shadow-[1px_1px_0px_1px_rgba(0,0,0,0.2)] whitespace-nowrap"
                    >
                        Created by Aj
                    </a>
                    <a
                        href="https://gemini.google.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-permanent-marker text-sm sm:text-base text-center text-white bg-white/10 backdrop-blur-sm border border-white/50 py-2 px-4 rounded-sm transform transition-transform duration-200 hover:scale-105 hover:rotate-2 hover:bg-white hover:text-black whitespace-nowrap"
                    >
                        Chat with Gemini
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;