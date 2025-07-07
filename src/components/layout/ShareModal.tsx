import React from "react";

const ShareModal = () => {
    return (
        <div role="dialog" id="radix-«rld»" aria-describedby="radix-«rlf»" aria-labelledby="radix-«rle»" data-state="open" className="popover bg-token-main-surface-primary relative start-1/2 col-auto col-start-2 row-auto row-start-2 h-full w-full text-start ltr:-translate-x-1/2 rtl:translate-x-1/2 rounded-2xl shadow-long flex flex-col focus:outline-hidden overflow-hidden max-w-[550px]" tabIndex={-1} style={{ pointerEvents: "auto" }}>
            <header className="min-h-header-height flex justify-between py-2.5 ps-4 pe-2 select-none">
                <div className="flex max-w-full items-center">
                    <div className="flex max-w-full min-w-0 grow flex-col">
                        <h2 id="radix-«rle»" className="text-token-text-primary text-lg font-normal">Share public link to chat</h2>
                    </div>
                </div>
                <div className="flex h-[max-content] items-center gap-2">
                    <button data-testid="close-button" className="hover:bg-token-main-surface-secondary focus-visible:ring-token-text-quaternary dark:hover:bg-token-main-surface-tertiary flex h-8 w-8 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent focus-visible:outline-hidden bg-transparent" aria-label="Close" type="button">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="icon">
                            <path d="M14.2548 4.75488C14.5282 4.48152 14.9717 4.48152 15.2451 4.75488C15.5184 5.02825 15.5184 5.47175 15.2451 5.74512L10.9902 10L15.2451 14.2549L15.3349 14.3652C15.514 14.6369 15.4841 15.006 15.2451 15.2451C15.006 15.4842 14.6368 15.5141 14.3652 15.335L14.2548 15.2451L9.99995 10.9902L5.74506 15.2451C5.4717 15.5185 5.0282 15.5185 4.75483 15.2451C4.48146 14.9718 4.48146 14.5282 4.75483 14.2549L9.00971 10L4.75483 5.74512L4.66499 5.63477C4.48589 5.3631 4.51575 4.99396 4.75483 4.75488C4.99391 4.51581 5.36305 4.48594 5.63471 4.66504L5.74506 4.75488L9.99995 9.00977L14.2548 4.75488Z"></path></svg>
                    </button>
                </div>
            </header>
            <div className="grow overflow-y-auto p-4 pt-1">
                <div className="w-full">
                    <p className="text-token-text-secondary mb-6">
                        <span>Your name, custom instructions, and any messages you add after sharing stay private.
                            <a href="https://help.openai.com/en/articles/7925741-chatgpt-shared-links-faq" className="text-token-text-secondary hover:text-token-text-tertiary inline-flex items-center gap-2 underline" target="_blank" rel="noreferrer">Learn more</a>
                        </span>
                    </p>
                </div>
                <div className="border-token-border-medium bg-token-main-surface-primary text-token-text-secondary has-focus-visible:border-token-border-xheavy mb-2 flex items-center justify-between rounded-full border p-1.5 last:mb-2 sm:p-2"><div className="relative ms-1 grow"><input readOnly disabled className="bg-token-main-surface-primary w-full rounded-xl border-0 px-2 py-1 text-lg focus:ring-0 sm:py-2.5 text-token-text-tertiary" type="text" value="https://chatgpt.com/share/…" />
                    <div className="from-token-main-surface-primary pointer-events-none absolute end-0 top-0 bottom-0 w-12 bg-linear-to-l">
                    </div>
                </div>
                    <button className="btn relative btn-primary ms-4 me-0 mt-0 rounded-full px-4 py-1 text-base font-bold sm:py-3" type="button" data-testid="create-link-shared-chat-button">
                        <div className="flex w-full items-center justify-center gap-1.5">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-label="" className="-ms-0.5 icon">
                                <path d="M4.50266 8.72527C4.74666 8.45077 5.16761 8.42561 5.44212 8.66961C5.71646 8.9136 5.74069 9.33363 5.4968 9.60808L4.70872 10.4958C3.51374 11.8401 3.57358 13.8831 4.84544 15.155L4.96653 15.2702C6.24392 16.4291 8.2022 16.4494 9.50462 15.2917L10.3913 14.5026L10.5007 14.4245C10.7684 14.2694 11.1172 14.318 11.3308 14.5583C11.5745 14.8328 11.5494 15.2528 11.2751 15.4968L10.3874 16.2858C8.57529 17.8963 5.85138 17.8686 4.07395 16.2565L3.90501 16.0954C2.1352 14.3256 2.05175 11.4827 3.71458 9.61199L4.50266 8.72527ZM12.03 7.02996C12.2897 6.77026 12.7107 6.77026 12.9704 7.02996C13.23 7.28967 13.2301 7.71075 12.9704 7.97039L7.97044 12.9704C7.71079 13.23 7.28972 13.2299 7.03001 12.9704C6.77031 12.7107 6.77031 12.2897 7.03001 12.03L12.03 7.02996ZM9.79075 3.56316C11.6599 2.05831 14.3811 2.19058 16.0954 3.90496L16.2566 4.0739C17.8167 5.79413 17.8929 8.40089 16.4363 10.2096L16.2859 10.3874L15.4968 11.2751L15.3982 11.3659C15.1506 11.5514 14.7986 11.5441 14.5583 11.3307C14.2838 11.0868 14.2587 10.6658 14.5027 10.3913L15.2917 9.50457L15.4001 9.37664C16.4472 8.07664 16.3918 6.20275 15.2702 4.96648L15.155 4.84539C13.9228 3.61321 11.967 3.51841 10.6238 4.60027L10.4958 4.70867L9.60813 5.49676C9.33367 5.74064 8.91365 5.71642 8.66965 5.44207C8.42565 5.16757 8.45082 4.74662 8.72532 4.50261L9.61204 3.71453L9.79075 3.56316Z">
                                </path>
                            </svg>Create link</div>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ShareModal;