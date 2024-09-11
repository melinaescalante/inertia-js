<script setup>
import { Link } from '@inertiajs/vue3'
</script>
<template>
    <nav class="flex justify-between items-center p-4 bg-slate-200 text-slate-800">
        <Link href="/" class="text-xl">Red Social</Link>

        <ul class="flex items-center">

            <li>
                <Link data-tooltip-target="tooltip-search" href="/buscador"
                    class="block px-4 rounded-s-full dark:hover:fill-gray-800 group m-auto">

                <svg class="w-7 h-6  text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
                    aria-hidden="true" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" >
                    
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C11.8487 18 13.551 17.3729 14.9056 16.3199L20.2929 21.7071C20.6834 22.0976 21.3166 22.0976 21.7071 21.7071C22.0976 21.3166 22.0976 20.6834 21.7071 20.2929L16.3199 14.9056C17.3729 13.551 18 11.8487 18 10C18 5.58172 14.4183 2 10 2Z"
                        />
                </svg>
                <span class="sr-only">Buscador</span>
                </Link>
            </li>

            <li>
                <Link data-tooltip-target="tooltip-chat" href="/chat"
                    class="block px-3 rounded-s-full dark:hover:fill-gray-800 group m-auto">


                <svg class="w-6 h-6  text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500 rotate-[270]"
                    aria-hidden="true" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  >
                    <path
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z" />
                </svg>
                <span class="sr-only">Chat</span>
                </Link>
            </li>

        </ul>
    </nav>
    <div
        class="fixed z-50 w-full h-16 max-w-lg -translate-x-1/2 bg-white border border-gray-200 rounded-full bottom-4 left-1/2 dark:bg-gray-700 dark:border-gray-600">
        <div class="grid h-full max-w-lg grid-cols-5 mx-auto">
            <Link data-tooltip-target="tooltip-home" href="/"
                class="inline-flex flex-col items-center justify-center px-5 rounded-s-full hover:bg-gray-50 dark:hover:bg-gray-800 group">

            <svg class="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
                aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path
                    d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
            </svg>
            <span class="sr-only">Home</span>
            </Link>
            <div id="tooltip-home" role="tooltip"
                class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                Home
                <div class="tooltip-arrow" data-popper-arrow></div>
            </div>
            <Link href="/descubrir" data-tooltip-target="tooltip-wallet"
                class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
            <svg class="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
                fill="currentColor" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                version="1.1" id="Layer_1" viewBox="0 0 511.995 511.995" xml:space="preserve">
                <g>
                    <g>
                        <g>
                            <path
                                d="M156.258,127.868c-1.665,0-3.211,0.974-3.928,2.477c-17.31,36.567-23.732,74.245-24.381,112.707     c-0.043,2.391,1.921,4.364,4.313,4.364h110.923c2.357,0,4.27-1.913,4.27-4.27V132.13c0-2.357-1.913-4.27-4.261-4.261H156.258z" />
                            <path
                                d="M169.589,110.78h73.595c2.357,0,4.27-1.904,4.27-4.278V18.406c0-3.775-4.552-5.739-7.25-3.091     c-28.301,27.78-56.431,59.864-74.33,89.018C164.14,107.159,166.275,110.78,169.589,110.78z" />
                            <path
                                d="M4.336,247.425h102.315c2.323,0,4.176-1.862,4.219-4.176c0.675-37.353,7.78-73.937,22.955-109.445     c1.204-2.818-0.786-5.944-3.851-5.944H36.497c-1.563,0-3.023,0.837-3.792,2.203C13.653,163.684,2.15,202.07,0.007,242.881     C-0.13,245.332,1.877,247.425,4.336,247.425z" />
                            <path
                                d="M50.92,110.789h91.546c1.546,0,2.946-0.828,3.689-2.195c18.36-33.852,45.927-68.121,77.985-100.069     c2.946-2.938,0.47-7.848-3.655-7.267C150.69,11.062,87.846,50.088,47.436,103.974C45.344,106.767,47.428,110.789,50.92,110.789z" />
                            <path
                                d="M378.214,133.82c15.354,35.517,22.178,72.101,22.904,109.428c0.043,2.314,1.904,4.167,4.219,4.167h102.315     c2.459,0,4.466-2.084,4.33-4.543c-2.143-40.811-13.646-79.189-32.699-112.818c-0.769-1.358-2.22-2.195-3.783-2.195h-93.442     C378.983,127.86,376.993,131.002,378.214,133.82z" />
                            <path
                                d="M365.84,108.62c0.743,1.349,2.126,2.161,3.664,2.161h91.563c3.501,0,5.585-4.014,3.484-6.815     c-40.513-54.031-103.57-93.1-173.596-102.784c-4.125-0.572-6.584,4.355-3.621,7.284C319.692,40.464,347.258,74.76,365.84,108.62z     " />
                            <path
                                d="M268.803,247.416h110.923c2.391,0,4.355-1.973,4.304-4.381c-0.717-38.437-6.815-76.132-24.364-112.716     c-0.717-1.494-2.263-2.459-3.92-2.459h-86.943c-2.357,0-4.27,1.913-4.27,4.27v111.017     C264.534,245.503,266.446,247.416,268.803,247.416z" />
                            <path
                                d="M268.803,110.789h73.553c3.331,0,5.457-3.638,3.706-6.465c-17.985-29.035-45.961-61.349-74.287-89.044     c-2.699-2.63-7.242-0.666-7.242,3.108v88.122C264.534,108.876,266.446,110.78,268.803,110.789z" />
                            <path
                                d="M243.184,401.131h-65.192c-3.288,0-5.389,3.595-3.74,6.439c21.383,36.84,48.087,68.967,65.782,88.173     c2.639,2.869,7.421,1.025,7.421-2.878v-87.464C247.454,403.044,245.541,401.131,243.184,401.131z" />
                            <path
                                d="M333.979,401.131h-65.175c-2.357,0-4.27,1.913-4.261,4.27v87.515c0,3.894,4.774,5.739,7.421,2.878     c17.711-19.155,44.168-51.256,65.747-88.216C339.367,404.735,337.266,401.131,333.979,401.131z" />
                            <path
                                d="M461.076,401.131h-100.06c-1.571,0-3.015,0.888-3.749,2.272c-22.929,43.194-48.437,78.566-67.831,100.35     c-2.681,3.015-0.094,7.583,3.903,7.011c69.496-9.898,130.982-49.018,171.222-102.818     C466.652,405.145,464.568,401.131,461.076,401.131z" />
                            <path
                                d="M507.66,264.496H405.115c-2.22,0-4.031,1.725-4.193,3.945c-2.963,39.957-16.43,76.926-31.17,109.625     c-1.281,2.827,0.734,5.986,3.834,5.978c21.358-0.009,88.207-0.034,101.956-0.009c1.563,0.009,2.98-0.828,3.749-2.186     c19.129-33.672,30.555-71.922,32.699-112.81C512.118,266.588,510.119,264.496,507.66,264.496z" />
                            <path
                                d="M243.193,264.496H132.552c-2.502,0-4.518,2.161-4.304,4.646c3.365,41.187,16.644,79.274,32.647,112.494     c0.717,1.486,2.229,2.417,3.877,2.417h78.42c2.357,0,4.27-1.913,4.27-4.27V268.765     C247.463,266.408,245.55,264.496,243.193,264.496z" />
                            <path
                                d="M268.803,384.06h78.429c1.648,0,3.16-0.931,3.877-2.408c16.14-33.237,29.36-71.332,32.656-112.511     c0.196-2.494-1.81-4.646-4.313-4.646H268.803c-2.357,0-4.27,1.913-4.27,4.27v111.017     C264.534,382.147,266.446,384.052,268.803,384.06z" />
                            <path
                                d="M154.712,403.411c-0.734-1.392-2.178-2.28-3.749-2.28H50.912c-3.493,0-5.576,4.022-3.484,6.815     c40.316,53.92,101.811,93.083,171.495,102.87c3.894,0.547,6.319-4.099,3.706-7.037     C203.312,482.003,177.505,446.622,154.712,403.411z" />
                            <path
                                d="M142.27,378.074c-14.663-32.716-28.164-69.693-31.187-109.642c-0.162-2.22-1.973-3.937-4.193-3.937H4.336     c-2.459,0-4.458,2.092-4.321,4.543c2.143,40.811,13.646,79.189,32.699,112.818c0.769,1.358,2.22,2.195,3.783,2.195h101.888     C141.484,384.052,143.534,380.901,142.27,378.074z" />
                        </g>
                    </g>
                </g>
            </svg>

            <span class="sr-only">Descubrir</span>
            </Link>
            <div id="tooltip-wallet" role="tooltip"
                class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                Wallet
                <div class="tooltip-arrow" data-popper-arrow></div>
            </div>
            <div class="flex items-center justify-center">
                <Link href="#" data-tooltip-target="tooltip-new"
                    class="inline-flex items-center justify-center w-10 h-10 font-medium bg-blue-600 rounded-full hover:bg-blue-700 group focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800">
                <svg class="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 18 18">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 1v16M1 9h16" />
                </svg>
                <span class="sr-only">New item</span>
                </Link>
            </div>
            <div id="tooltip-new" role="tooltip"
                class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                Create new item
                <div class="tooltip-arrow" data-popper-arrow></div>
            </div>
            <Link href="/misSeries" data-tooltip-target="tooltip-settings"
                class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
            <svg class="w-7 h-7 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
                aria-hidden="true" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M3 17V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 7h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h7zm0 0L8 3m4 4 4-4" />
            </svg>

            <span class="sr-only">Mis Series</span>
            </Link>
            <div id="tooltip-settings" role="tooltip"
                class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                Mis Series
                <div class="tooltip-arrow" data-popper-arrow></div>
            </div>
            <Link href="/perfil" data-tooltip-target="tooltip-profile"
                class="inline-flex flex-col items-center justify-center px-5 rounded-e-full hover:bg-gray-50 dark:hover:bg-gray-800 group">
            <svg class="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
                aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path
                    d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
            </svg>
            <span class="sr-only">Profile</span>
            </Link>
            <div id="tooltip-profile" role="tooltip"
                class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                Profile
                <div class="tooltip-arrow" data-popper-arrow></div>
            </div>
        </div>
    </div>
</template>