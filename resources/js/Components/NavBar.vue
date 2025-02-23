<script setup>
import { Link, usePage } from '@inertiajs/vue3'
import { ref, onMounted, onUnmounted } from 'vue';
import ButtonGoBack from '../components/ButtonGoBack.vue'
import NavItem from './NavItem.vue';
import { useLoginUser } from '../composables/useLoginUser';


const loading = ref(true);

const { loginUser } = useLoginUser()
const page = usePage()
const currentPage = page.component
const userUrl = ref('')
onMounted(async () => {
    if (loginUser.value.id !== null) {

        userUrl.value = `/perfil/${loginUser.value.id}`
        loading.value = false;
    } else {
        loading.value = false;
    }
})


const excludedPages = [
    'HomeView',
    'HomeFollowingView',
    'DiscoverView',
    'SeriesView',
    'SearchView',
    'SearchUsersView',
    'Profile/ProfileAuthView'
];

</script>
<template>

    <nav
        class="z-[9999]  skiptranslate flex justify-between items-center p-2 py-2 ps-5 border-blue-0 border rounded-lg  text-slate-800 fixed w-full bg-white top-0  max-w-2xl">
        <div v-if="!loading" class="flex items-center gap-6">

            <ButtonGoBack v-if="!excludedPages.includes(currentPage)">
            </ButtonGoBack>
            <Link href="/" class="text-xl">
            <!-- <img src="/public/images/ImagotipoEspesorApilado.svg" alt="Isotipo-TVON" class="block h-auto w-16"> -->
            <svg class="block h-auto w-16 " xmlns="http://www.w3.org/2000/svg" id="Capa_1" data-name="Capa 1" viewBox="0 0 118.16 85.2">

                <path class="cls-5 "
                    d="M57.16,40.79c-.01.16-.02.33-.02.49s.01.33.02.49v31.04c0,2.23-1.81,4.03-4.04,4.03-.55,0-1.09-.11-1.57-.32-.03-.01-.06-.02-.08-.04l-.73-.42h-.01l-22.15-12.81,2.06-1.19.67-.39c1.24-.86,2.05-2.29,2.05-3.92s-.83-3.1-2.1-3.95l-.02-.02c-.14-.09-.29-.18-.44-.25l-.03-.02-2.19-1.26,19.03-11,9.55-5.52v5.06Z" />
                <path class="cls-4 "
                    d="M33.36,57.75c0,1.63-.81,3.06-2.05,3.92l-.67.39-2.06,1.19h-.01l-22.17,12.82s-.01.02-.02.01l-.69.4s-.05.03-.08.04c-.48.21-1.02.32-1.57.32-2.23,0-4.04-1.81-4.04-4.04v-25.99l9.59-5.54,18.98,10.98h.01l2.19,1.26.03.02.15.09.29.16.02.02c1.27.85,2.1,2.31,2.1,3.95Z" />
                <path class="cls-4 "
                    d="M57.16,9.73v26l-9.55,5.52-19-10.98,1.97-1.13.84-.49c1.19-.86,1.97-2.27,1.97-3.85s-.83-3.08-2.09-3.94l-.5-.29-2.26-1.3,22.31-12.89c.13-.09.27-.17.41-.24.56-.29,1.18-.45,1.85-.45,2.23,0,4.05,1.81,4.05,4.04Z" />
                <path class="cls-5 "
                    d="M33.39,24.8c0,1.58-.78,2.99-1.97,3.85l-.84.49-1.97,1.13-19.02,11L0,46.81V9.75c0-2.23,1.8-4.03,4.03-4.03.69,0,1.35.18,1.92.49l22.59,13.06,2.26,1.3.5.29c1.26.86,2.09,2.3,2.09,3.94Z" />
                <text class="cls-2" transform="translate(65.35 31.55)">
                    <tspan class="cls-1 ">
                        <tspan x="0" y="0">TV</tspan>
                    </tspan>
                    <tspan class="cls-3 font-bold">
                        <tspan x="0" y="44.64">ON</tspan>
                    </tspan>
                </text>

            </svg>
            </Link>
        </div>

        <ul class="flex items-center">
            <template
                v-if="currentPage !== 'Profile/ProfileAuthView' && currentPage !== 'Profile/ChatView' && currentPage !== 'ConfigView'">
                <li>
                    <Link data-tooltip-target="tooltip-search" href="/buscador"
                        class="block px-4 rounded-s-full  group m-auto">

                    <svg class="w-7 h-6  group-hover:text-blue-1000 " aria-hidden="true"
                        :class="currentPage === 'SearchView' || currentPage === 'SearchUsersView' ? 'text-blue-1000' : 'text-gray-500'"
                        fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <title>Búsqueda</title>

                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C11.8487 18 13.551 17.3729 14.9056 16.3199L20.2929 21.7071C20.6834 22.0976 21.3166 22.0976 21.7071 21.7071C22.0976 21.3166 22.0976 20.6834 21.7071 20.2929L16.3199 14.9056C17.3729 13.551 18 11.8487 18 10C18 5.58172 14.4183 2 10 2Z" />
                    </svg>
                    <span class="sr-only">Buscador</span>
                    </Link>
                </li>

                <li>
                    <Link data-tooltip-target="tooltip-chat" href="/chat"
                        class="block px-3 rounded-s-full group m-auto">



                    <svg class="w-6 h-6  text-gray-500 group-hover:text-blue-1000  rotate-[270]" aria-hidden="true"
                        fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <title>Chat</title>
                        <path
                            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z" />
                    </svg>
                    <span class="sr-only">Chat</span>
                    </Link>
                </li>

            </template>
            <template v-if="loginUser.id !== null && currentPage === 'Profile/ProfileAuthView'">
                <li>
                    <Link data-tooltip-target="tooltip-config" href="/configuraciones"
                        class="block px-3 rounded-s-full group m-auto">


                    <svg class="w-7 h-6  text-gray-500 group-hover:text-blue-1000 " aria-hidden="true"
                        fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="800px" height="800px"
                        viewBox="0 0 28 28">
                        <path clip-rule="evenodd"
                            d="M14 20C17.3137 20 20 17.3137 20 14C20 10.6863 17.3137 8 14 8C10.6863 8 8 10.6863 8 14C8 17.3137 10.6863 20 14 20ZM18 14C18 16.2091 16.2091 18 14 18C11.7909 18 10 16.2091 10 14C10 11.7909 11.7909 10 14 10C16.2091 10 18 11.7909 18 14Z"
                            fill-rule="evenodd" />
                        <path clip-rule="evenodd"
                            d="M0 12.9996V14.9996C0 16.5478 1.17261 17.822 2.67809 17.9826C2.80588 18.3459 2.95062 18.7011 3.11133 19.0473C2.12484 20.226 2.18536 21.984 3.29291 23.0916L4.70712 24.5058C5.78946 25.5881 7.49305 25.6706 8.67003 24.7531C9.1044 24.9688 9.55383 25.159 10.0163 25.3218C10.1769 26.8273 11.4511 28 12.9993 28H14.9993C16.5471 28 17.8211 26.8279 17.9821 25.3228C18.4024 25.175 18.8119 25.0046 19.2091 24.8129C20.3823 25.6664 22.0344 25.564 23.0926 24.5058L24.5068 23.0916C25.565 22.0334 25.6674 20.3813 24.814 19.2081C25.0054 18.8113 25.1757 18.4023 25.3234 17.9824C26.8282 17.8211 28 16.5472 28 14.9996V12.9996C28 11.452 26.8282 10.1782 25.3234 10.0169C25.1605 9.55375 24.9701 9.10374 24.7541 8.66883C25.6708 7.49189 25.5882 5.78888 24.5061 4.70681L23.0919 3.29259C21.9846 2.18531 20.2271 2.12455 19.0485 3.1103C18.7017 2.94935 18.3459 2.80441 17.982 2.67647C17.8207 1.17177 16.5468 0 14.9993 0H12.9993C11.4514 0 10.1773 1.17231 10.0164 2.6775C9.60779 2.8213 9.20936 2.98653 8.82251 3.17181C7.64444 2.12251 5.83764 2.16276 4.70782 3.29259L3.2936 4.7068C2.16377 5.83664 2.12352 7.64345 3.17285 8.82152C2.98737 9.20877 2.82199 9.60763 2.67809 10.0167C1.17261 10.1773 0 11.4515 0 12.9996ZM15.9993 3C15.9993 2.44772 15.5516 2 14.9993 2H12.9993C12.447 2 11.9993 2.44772 11.9993 3V3.38269C11.9993 3.85823 11.6626 4.26276 11.2059 4.39542C10.4966 4.60148 9.81974 4.88401 9.18495 5.23348C8.76836 5.46282 8.24425 5.41481 7.90799 5.07855L7.53624 4.70681C7.14572 4.31628 6.51256 4.31628 6.12203 4.7068L4.70782 6.12102C4.31729 6.51154 4.31729 7.14471 4.70782 7.53523L5.07958 7.90699C5.41584 8.24325 5.46385 8.76736 5.23451 9.18395C4.88485 9.8191 4.6022 10.4963 4.39611 11.2061C4.2635 11.6629 3.85894 11.9996 3.38334 11.9996H3C2.44772 11.9996 2 12.4474 2 12.9996V14.9996C2 15.5519 2.44772 15.9996 3 15.9996H3.38334C3.85894 15.9996 4.26349 16.3364 4.39611 16.7931C4.58954 17.4594 4.85042 18.0969 5.17085 18.6979C5.39202 19.1127 5.34095 19.6293 5.00855 19.9617L4.70712 20.2632C4.3166 20.6537 4.3166 21.2868 4.70712 21.6774L6.12134 23.0916C6.51186 23.4821 7.14503 23.4821 7.53555 23.0916L7.77887 22.8483C8.11899 22.5081 8.65055 22.4633 9.06879 22.7008C9.73695 23.0804 10.4531 23.3852 11.2059 23.6039C11.6626 23.7365 11.9993 24.1411 11.9993 24.6166V25C11.9993 25.5523 12.447 26 12.9993 26H14.9993C15.5516 26 15.9993 25.5523 15.9993 25V24.6174C15.9993 24.1418 16.3361 23.7372 16.7929 23.6046C17.5032 23.3985 18.1809 23.1157 18.8164 22.7658C19.233 22.5365 19.7571 22.5845 20.0934 22.9208L20.2642 23.0916C20.6547 23.4821 21.2879 23.4821 21.6784 23.0916L23.0926 21.6774C23.4831 21.2868 23.4831 20.6537 23.0926 20.2632L22.9218 20.0924C22.5855 19.7561 22.5375 19.232 22.7669 18.8154C23.1166 18.1802 23.3992 17.503 23.6053 16.7931C23.7379 16.3364 24.1425 15.9996 24.6181 15.9996H25C25.5523 15.9996 26 15.5519 26 14.9996V12.9996C26 12.4474 25.5523 11.9996 25 11.9996H24.6181C24.1425 11.9996 23.7379 11.6629 23.6053 11.2061C23.3866 10.4529 23.0817 9.73627 22.7019 9.06773C22.4643 8.64949 22.5092 8.11793 22.8493 7.77781L23.0919 7.53523C23.4824 7.14471 23.4824 6.51154 23.0919 6.12102L21.6777 4.7068C21.2872 4.31628 20.654 4.31628 20.2635 4.7068L19.9628 5.00748C19.6304 5.33988 19.1137 5.39096 18.6989 5.16979C18.0976 4.84915 17.4596 4.58815 16.7929 4.39467C16.3361 4.2621 15.9993 3.85752 15.9993 3.38187V3Z"
                            fill="currentColor" fill-rule="evenodd" />
                    </svg>

                    <span class="sr-only">Configuraciones</span>
                    </Link>
                </li>
            </template>

        </ul>
    </nav>
    <div
        class="skiptranslate fixed  w-full h-18 max-w-2xl -translate-x-1/2 bg-white border border-blue-0 rounded-full bottom-4 left-1/2 z-[9999] ">
        <div class="grid md:gap-x-10 h-full max-w-lg grid-cols-[repeat(auto-fit,_minmax(60px,_1fr))] mx-auto">
            <NavItem titleLink="Inicio" route="/" roundedClass="rounded-s-full ">
                <svg class="w-5 h-5 mb-1  group-hover:text-blue-1000 " aria-hidden="true" :class="{
                    'text-blue-1000': currentPage === 'HomeView' || currentPage === 'HomeFollowingView',
                    'text-gray-500': !(currentPage === 'HomeView' || currentPage === 'HomeFollowingView'),
                    'mt-[0.7rem]': !loginUser.id
                }" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <title>Inicio</title>
                    <path
                        d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                </svg>
            </NavItem>

            <NavItem titleLink="Descubrir" route="/descubrir" roundedClass=" ">
                <svg class="w-5 h-5 mb-1 group-hover:text-blue-1000 " fill="currentColor"
                    :class="currentPage === 'DiscoverView' ? 'text-blue-1000' : 'text-gray-500'"
                    xmlns="http://www.w3.org/2000/svg" version="1.1" id="Layer_1" viewBox="0 0 511.995 511.995"
                    xml:space="preserve">
                    <title>Descubrir</title>
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


            </NavItem>

            <div v-if="loginUser.id !== null" class="flex items-center justify-center">

                <NavItem titleLink="Postear" route="/subirPublicacion"
                    roundedClass="w-8 h-8 bg-blue-500 rounded-full hover:bg-blue-1000 group focus:ring-4 focus:ring-blue-300 focus:outline-none text-white  ">
                    <!--h-auto w-auto  -->
                    <svg class="w-[1.3rem] h-[1.3rem] text-white " aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 18 18">
                        <title>Postear</title>

                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 1v16M1 9h16" />
                    </svg>

                </NavItem>
            </div>
            <NavItem v-if="loginUser.id !== null" titleLink="Mis series" route="/misSeries" roundedClass=" ">
                <svg class="w-6 h-6 mb-1 group-hover:text-blue-1000 " aria-hidden="true"
                    :class="currentPage === 'SeriesView' ? 'text-blue-1000' : 'text-gray-500'" fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <title>Mis series</title>

                    <path d="M3 17V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 7h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h7zm0 0L8 3m4 4 4-4" />
                </svg>
                <span class="sr-only">Mis series</span>
            </NavItem>
            <NavItem titleLink="Mi Perfil" :route="`/miPerfil`" roundedClass=" rounded-e-full ">

                <svg class="w-5 h-5 mb-1   group-hover:text-blue-1000 "
                    :class="currentPage === 'Profile/ProfileAuthView' ? 'text-blue-1000' : 'text-gray-500'"
                    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <title>Perfil</title>

                    <path
                        d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                </svg>
                <span class="sr-only">Perfil</span>
            </NavItem>

        </div>
    </div>
</template>

<style>
#Capa_1, .cls-1{
    filter: drop-shadow(0px 1px 3px white);
}
.cls-1 {
    fill: #1e1e1c;
    font-family: Fredoka-Light, Fredoka;
    font-weight: 300;
}

.cls-2 {
    font-size: 37.11px;
}

.cls-3 {
    font-family: Fredoka-Medium, Fredoka;
    font-weight: 600;
}

.cls-3,
.cls-4 {
    fill: #003399;
}

.cls-5 {
    fill: #f49739;
}

</style>