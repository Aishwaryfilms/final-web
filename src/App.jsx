import { useState, useEffect, useCallback } from "react";
import { supabase } from './supabaseClient';
import merchPreview from './assets/merch-preview.jpg';

const RED = "#e02020";

const SOCIAL_LINKS = [
  { label: "D", href: "https://discord.gg/hH7gfXsDuq", name: "Discord" },
  { label: "X", href: "https://x.com/YOUeSportsIND", name: "X" },
  { label: "IG", href: "https://www.instagram.com/you.esports/", name: "Instagram" },
  { label: "YT", href: "https://www.youtube.com/@YOUeSportsCC", name: "YouTube" },
];

const SECTION_IDS = ["home", "about", "roster", "creators", "shop", "contact"];

const NAV_LABELS = {
  creators: "CREATORS",
  shop: "ARMORY",
};

const CONTACT_INFO_ITEMS = [
  { type: "email", label: "EMAIL", value: "contact@youesports.org" },
  { type: "location", label: "LOCATION", value: "Mumbai, India" },
  { type: "hours", label: "HOURS", value: "Mon-Sat - 10 AM - 7 PM IST" },
];

const getPageFromHash = () => {
  const page = window.location.hash.replace(/^#\/?/, "");
  return SECTION_IDS.includes(page) ? page : "home";
};

const getPageHref = (page) => `#${page}`;

const getNavLabel = (section) => NAV_LABELS[section] || section.toUpperCase();

const SocialIcon = ({ name }) => {
  switch (name) {
    case "Discord":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="social-icon">
          <path
            fill="currentColor"
            d="M20.317 4.369a19.79 19.79 0 0 0-5.191-1.569 13.7 13.7 0 0 0-.666 1.35 18.42 18.42 0 0 0-5.919 0 13.3 13.3 0 0 0-.666-1.35A19.74 19.74 0 0 0 2.683 4.37C-.327 8.874-.923 13.268-.625 17.6a19.95 19.95 0 0 0 6.117 3.104 14.9 14.9 0 0 0 1.308-2.108 12.8 12.8 0 0 1-2.003-.966c.167-.126.329-.257.487-.392a.05.05 0 0 1 .052-.006c3.857 1.762 8.035 1.762 11.846 0a.05.05 0 0 1 .053.006c.158.135.32.266.487.392a12.8 12.8 0 0 1-2.003.966 14.9 14.9 0 0 0 1.308 2.108 19.94 19.94 0 0 0 6.117-3.104c.35-5.021-.596-9.376-3.529-13.23zM8.02 15.331c-1.182 0-2.153-1.086-2.153-2.419s.95-2.419 2.153-2.419c1.208 0 2.174 1.094 2.153 2.419 0 1.333-.95 2.419-2.153 2.419zm7.96 0c-1.182 0-2.153-1.086-2.153-2.419s.95-2.419 2.153-2.419c1.208 0 2.174 1.094 2.153 2.419 0 1.333-.945 2.419-2.153 2.419z"
          />
        </svg>
      );
    case "X":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="social-icon">
          <path
            fill="currentColor"
            d="M4.5 3h4.6l4 5.4L17.6 3H21l-6.4 7.3L21.7 21h-4.6l-4.5-6.1L7.2 21H3.8l6.9-7.9L4.5 3Zm2.1 1.8 11.4 15.4h1.6L8.2 4.8H6.6Z"
          />
        </svg>
      );
    case "Instagram":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="social-icon">
          <rect x="4" y="4" width="16" height="16" rx="4.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="3.3" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="17" cy="7" r="1.1" fill="currentColor" />
        </svg>
      );
    case "YouTube":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="social-icon">
          <rect x="3" y="6.5" width="18" height="11" rx="4" fill="currentColor" opacity="0.18" />
          <path fill="currentColor" d="M10 8.5 16 12l-6 3.5v-7Z" />
        </svg>
      );
    default:
      return null;
  }
};

const ContactInfoIcon = ({ type }) => {
  switch (type) {
    case "email":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <rect x="3" y="6" width="18" height="12" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M4 8l8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "location":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="11" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
    case "hours":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="8.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 8.2v4.3l3.1 1.9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
};

const LogoSVG = () => (
  <svg
    viewBox="0 0 297 346"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: "100%", height: "100%", overflow: "visible", display: "block" }}
  >
    <g>
      <path d="M0 0 C3.10632685 1.37157519 5.12070341 2.91202803 7.43359375 5.38671875 C8.07562744 6.06968018 8.71766113 6.7526416 9.37915039 7.45629883 C10.05840576 8.19259521 10.73766113 8.9288916 11.4375 9.6875 C12.5037561 10.83545044 12.5037561 10.83545044 13.59155273 12.0065918 C15.73783913 14.32867338 17.87171643 16.66141573 20 19 C20.58555664 19.64227539 21.17111328 20.28455078 21.77441406 20.94628906 C30.56474183 30.65805678 38.564111 40.9115212 46.18212891 51.56347656 C47.86716207 53.82195507 49.64565864 55.9144365 51.51171875 58.0234375 C67.48471056 77.42543315 63.18343631 110.22121938 63 134 C61.35 134.33 59.7 134.66 58 135 C54.76096281 127.50831992 51.88881059 119.95074516 49.20898438 112.24267578 C44.45028363 98.60845919 38.98896705 86.09620945 31 74 C30.30342285 72.92226318 30.30342285 72.92226318 29.59277344 71.82275391 C24.02682322 63.2430359 18.14897377 55.34314343 11 48 C1.35071066 64.54163886 2.20976398 83.48290404 2 102 C2.66 102 3.32 102 4 102 C4.50790159 105.51973999 5.00488523 109.04094042 5.5 112.5625 C5.64308594 113.55314453 5.78617188 114.54378906 5.93359375 115.56445312 C6.32548911 118.37303654 6.66950453 121.18362689 7 124 C7.15210938 125.13824219 7.30421875 126.27648437 7.4609375 127.44921875 C6.70347333 133.28426052 3.83585193 138.0840014 1.125 143.25 C0.24122681 144.97404053 0.24122681 144.97404053 -0.66040039 146.73291016 C-2.42450511 150.16373701 -4.20845974 153.58343271 -6 157 C-6.49516113 157.9477832 -6.99032227 158.89556641 -7.50048828 159.87207031 C-10.95925007 166.48574233 -14.42308616 173.09712167 -17.984375 179.65625 C-18.82742187 181.24953125 -18.82742187 181.24953125 -19.6875 182.875 C-20.16574219 183.75929687 -20.64398437 184.64359375 -21.13671875 185.5546875 C-23.1307525 191.20294601 -19.41202003 196.96585377 -17.10546875 202.09765625 C-16.71684158 202.96893661 -16.32821442 203.84021698 -15.92781067 204.73789978 C-15.10585792 206.57558062 -14.28114408 208.41202865 -13.45385742 210.24731445 C-12.19241649 213.05157037 -10.94642559 215.86235366 -9.70117188 218.67382812 C-8.89937265 220.46135726 -8.09666831 222.24848073 -7.29296875 224.03515625 C-6.92302292 224.87377701 -6.55307709 225.71239777 -6.17192078 226.57643127 C-3.13273352 233.25696515 0.03437206 236.6691291 6.48046875 240.3203125 C7.55506348 240.93382568 8.6296582 241.54733887 9.73681641 242.17944336 C11.44490479 243.1424939 11.44490479 243.1424939 13.1875 244.125 C14.35898047 244.79166286 15.53003971 245.45906646 16.70068359 246.12719727 C18.45967596 247.13107633 20.21887214 248.13456694 21.97943115 249.13569641 C27.05567372 252.02311977 32.09742464 254.96635788 37.125 257.9375 C39.39375 259.278125 41.6625 260.61875 44 262 C44.33 252.43 44.66 242.86 45 233 C43.35 232.34 41.7 231.68 40 231 C38.03896023 229.83025698 36.10148617 228.62024401 34.1875 227.375 C33.21167969 226.74335938 32.23585938 226.11171875 31.23046875 225.4609375 C30.49441406 224.97882813 29.75835937 224.49671875 29 224 C28.87625 225.11375 28.7525 226.2275 28.625 227.375 C28 231 28 231 26 233 C23.625 233.4375 23.625 233.4375 21 233 C16.76826117 228.8293465 15.4296858 224.0352613 13.765625 218.5 C13.48273621 217.58669922 13.19984741 216.67339844 12.90838623 215.73242188 C12.31490765 213.80763536 11.72689829 211.88115498 11.14404297 209.953125 C10.25180758 207.00597066 9.34021317 204.06533347 8.42578125 201.125 C7.85040576 199.25035464 7.27614877 197.37536555 6.703125 195.5 C6.43131409 194.62279297 6.15950317 193.74558594 5.87945557 192.84179688 C4.6686914 188.80677075 3.62199609 185.26510769 4 181 C6.046875 180.22265625 6.046875 180.22265625 9 180 C11.61108384 181.36989962 13.85145921 182.75636578 16.25 184.4375 C17.76590675 185.45984788 19.28290314 186.48058129 20.80078125 187.5 C21.62787598 188.06074219 22.4549707 188.62148437 23.30712891 189.19921875 C28.29346653 192.53369076 33.37334855 195.72299615 38.4375 198.9375 C41.47094007 200.86387995 44.48445761 202.79252681 47.44897461 204.82397461 C50.11589752 206.57735353 52.79426006 207.76205466 55.75610352 208.94360352 C61.19949167 211.37559374 65.7479868 213.85453863 69 219 C71.77422742 229.4843229 70.68785689 240.89979419 70.17492676 251.63214111 C69.87992066 258.00936575 69.70816665 264.38809859 69.59481621 270.77087212 C69.53657807 272.98119362 69.41677287 275.18165599 69.28956604 277.38893127 C69.00449072 284.70932425 69.61394427 289.4605304 74.35498047 295.30224609 C75.87196346 296.89855996 77.41678583 298.46935039 79 300 C79.93582341 301.03630008 80.86587878 302.07790091 81.78515625 303.12890625 C82.53667969 303.93199219 83.28820312 304.73507812 84.0625 305.5625 C88.62764598 310.52057717 92.86734167 315.67833662 97 321 C103.91015065 313.68399815 110.71034111 306.36207361 117 298.5 C119 296 119 296 121.60163879 293.28276062 C124.40673445 289.90189088 124.54702085 287.39437806 124.3737793 282.97583008 C124.35534973 282.30011963 124.33692017 281.62440918 124.31793213 280.92822266 C124.27677609 279.46946505 124.22500972 278.01097544 124.16367149 276.55292702 C124.07284377 274.23443324 124.02514946 271.91878146 123.99067688 269.59880066 C123.89087522 263.00801106 123.76108109 256.42091538 123.48950195 249.8347168 C122.42210583 222.82716863 122.42210583 222.82716863 126.71331787 216.45639038 C130.84801142 212.61479579 135.44204294 210.59384513 140.74943542 208.84182739 C144.30031383 207.51361547 147.19910192 205.39768557 150.25 203.1875 C157.58674249 198.19814853 165.08428576 193.46488003 172.58886719 188.7331543 C173.4915332 188.16250244 174.39419922 187.59185059 175.32421875 187.00390625 C176.5321106 186.24315796 176.5321106 186.24315796 177.7644043 185.46704102 C180.0255891 184.03397682 180.0255891 184.03397682 182.08911133 182.32397461 C184.74720231 180.48229486 186.84730158 180.78504329 190 181 C190.34848082 187.04356562 189.10907264 191.97604123 187.33203125 197.73046875 C187.05534103 198.64331131 186.77865082 199.55615387 186.49357605 200.49665833 C185.90764696 202.41690071 185.31650748 204.33556012 184.72045898 206.25268555 C183.81389987 209.18297516 182.93658726 212.12101017 182.06054688 215.06054688 C181.48613692 216.93022971 180.91002249 218.79938992 180.33203125 220.66796875 C180.07347855 221.54406296 179.81492584 222.42015717 179.54853821 223.32279968 C177.98100146 228.25641149 176.68108627 231.2675224 172 234 C169.828125 234.00390625 169.828125 234.00390625 168 233 C166.734375 231.15234375 166.734375 231.15234375 165.75 228.9375 C165.41484375 228.20402344 165.0796875 227.47054687 164.734375 226.71484375 C164.49203125 226.14894531 164.2496875 225.58304688 164 225 C163.15695313 225.5775 162.31390625 226.155 161.4453125 226.75 C160.33870565 227.50024193 159.23192581 228.25022874 158.125 229 C157.03445312 229.7425 155.94390625 230.485 154.8203125 231.25 C152 233 152 233 150 233 C150.33 242.57 150.66 252.14 151 262 C152.81242188 260.97261719 154.62484375 259.94523437 156.4921875 258.88671875 C157.11212585 258.53587219 157.73206421 258.18502563 158.37078857 257.82354736 C161.51165853 256.04267719 164.64080336 254.24434927 167.75488281 252.41699219 C178.79878009 245.95822861 178.79878009 245.95822861 184.3046875 243.75390625 C198.9423129 237.46371714 203.20754633 223.68591683 208.83395386 209.75495911 C209.96324485 206.90744661 211.07268988 204.05442778 212.129776 201.17927551 C213 199 213 199 214.22850037 196.57695007 C216.56642196 191.82514676 216.56642196 191.82514676 216.59143066 186.66438293 C215.5996948 184.19802248 214.43047442 181.96122334 213.11328125 179.65234375 C212.66284958 178.79677383 212.21241791 177.94120392 211.74833679 177.05970764 C210.30285994 174.33297777 208.8094842 171.63623052 207.3125 168.9375 C206.35540806 167.15346765 205.4016008 165.36766904 204.45117188 163.58007812 C201.22179277 157.53114154 197.93510609 151.51407589 194.62750244 145.50759888 C193.34629254 143.17611762 192.07656807 140.83869824 190.80859375 138.5 C190.42512283 137.81127304 190.04165192 137.12254608 189.64656067 136.41294861 C186.54064313 130.65646173 186.3148001 127.1612335 188 121 C190.51776766 109.61253306 191.34553641 98.44918441 191.4375 86.8125 C191.45528 85.80700104 191.45528 85.80700104 191.47341919 84.78118896 C191.67528327 71.66663883 189.5729194 59.50260895 183 48 C174.95344185 57.05892338 168.30334938 66.66775396 162 77 C161.58830566 77.6707959 161.17661133 78.3415918 160.75244141 79.03271484 C153.43242675 91.08798482 148.59894821 103.67447342 143.89453125 116.92578125 C143.5375415 117.92464355 143.18055176 118.92350586 142.81274414 119.95263672 C142.11653208 121.90804419 141.42917407 123.86663197 140.75170898 125.82861328 C140.27906616 127.16448486 140.27906616 127.16448486 139.796875 128.52734375 C139.52198242 129.31874756 139.24708984 130.11015137 138.96386719 130.92553711 C137.94061445 133.12781131 136.81180598 134.4065415 135 136 C133.68 135.34 132.36 134.68 131 134 C130.73193741 123.68365201 131.4485315 113.44763807 132.171875 103.16259766 C132.37548735 100.24301198 132.5669339 97.32278629 132.7578125 94.40234375 C132.88728326 92.52338653 133.01746681 90.64447826 133.1484375 88.765625 C133.20373627 87.90398743 133.25903503 87.04234985 133.31600952 86.15460205 C133.78698938 79.69610568 134.41177314 72.92856316 137.92578125 67.31640625 C138.30355713 66.70756592 138.68133301 66.09872559 139.07055664 65.47143555 C139.48039795 64.84148682 139.89023926 64.21153809 140.3125 63.5625 C140.74618896 62.88292236 141.17987793 62.20334473 141.62670898 61.50317383 C146.9483923 53.31906285 152.93192969 45.63818598 159 38 C159.80566406 36.9790625 160.61132812 35.958125 161.44140625 34.90625 C166.16114435 29.02979612 171.1600628 23.45410572 176.28515625 17.93359375 C179.57508204 14.37858042 182.80382135 10.77141531 186.02734375 7.15625 C187.96194032 5.04160187 189.95769408 3.0103235 192 1 C199.08228637 3.74302995 202.48096543 12.64848714 205.625 19.125 C214.4527587 39.59726936 217.17549706 62.00357551 217.1875 84.125 C217.20478149 85.80879761 217.20478149 85.80879761 217.22241211 87.52661133 C217.22920851 93.25917311 216.98331368 98.72230501 216.0234375 104.37890625 C213.13485494 122.33435774 218.34553183 133.80949775 226.8162384 149.12475586 C230.34054574 155.51306543 233.4018947 162.08295717 236.41525269 168.72418213 C237.727861 171.61486687 239.05958831 174.49667104 240.390625 177.37890625 C240.82407227 178.3232251 241.25751953 179.26754395 241.70410156 180.24047852 C242.99667506 183.08534897 242.99667506 183.08534897 244.72558594 186.03881836 C246.20253125 189.47059417 245.96206429 190.48286099 245 194 C244.35556366 195.53630936 243.65238181 197.04888871 242.90209961 198.53637695 C242.46751938 199.40531082 242.03293915 200.27424469 241.58518982 201.16950989 C241.11235062 202.09970444 240.63951141 203.02989899 240.15234375 203.98828125 C239.4171627 205.45227608 239.4171627 205.45227608 238.66712952 206.94584656 C237.0962065 210.0709308 235.51703265 213.19176 233.9375 216.3125 C232.38952587 219.38595075 230.84320344 222.46022801 229.2971344 225.53463745 C228.28733318 227.53866722 227.27460464 229.54122474 226.25889587 231.54226685 C224.016931 235.96200805 221.79982141 240.38538768 219.69555664 244.87255859 C219.346548 245.6059697 218.99753937 246.3393808 218.63795471 247.09501648 C218.0123458 248.41604244 217.39914812 249.74306904 216.80259705 251.07746887 C213.94060539 257.07213705 209.36069675 260.17787712 203.640625 263.32421875 C197.88726912 266.59525937 192.37069152 270.2232386 186.8125 273.8125 C184.6595719 275.18862353 182.50592617 276.56362499 180.3515625 277.9375 C174.44976816 281.70804095 168.56250993 285.50037073 162.6875 289.3125 C161.86419189 289.84528564 161.04088379 290.37807129 160.19262695 290.92700195 C159.43167725 291.42159912 158.67072754 291.91619629 157.88671875 292.42578125 C157.22889404 292.85286377 156.57106934 293.27994629 155.89331055 293.7199707 C154.51981508 294.64856344 153.18670532 295.63779178 151.88208008 296.66088867 C150 298 150 298 148 298 C146.98246262 300.9689186 146.03038823 303.85843993 145.37109375 306.9296875 C144.19082321 310.65321881 142.9702193 313.45532836 140 316 C133.07030454 319.47290552 125.42111344 321.27516528 117.95068359 323.21435547 C114.32219172 324.1804722 110.80476756 325.35576072 107.25 326.5625 C103.25004369 327.90885401 101.08172694 327.92266582 97 327 C95.95739014 327.02658691 94.91478027 327.05317383 93.84057617 327.08056641 C87.29577815 326.94327168 81.19802576 324.95730049 74.95776367 323.12426758 C73.36950411 322.6688834 71.77414355 322.23753176 70.17260742 321.83129883 C56.22126001 318.28273833 56.22126001 318.28273833 52.12060547 312.35595703 C49.50492312 307.87898909 47 303.26675864 47 298 C46.48824219 297.76152344 45.97648437 297.52304687 45.44921875 297.27734375 C42.1282899 295.54537607 38.98036011 293.5556264 35.8125 291.5625 C34.75953735 290.90205688 34.75953735 290.90205688 33.68530273 290.22827148 C26.46745039 285.68778999 19.31171664 281.05269969 12.16308594 276.40429688 C9.23542947 274.50363322 6.302169 272.6117414 3.3671875 270.72241211 C1.92050277 269.78663653 0.47773272 268.84477949 -0.9609375 267.89672852 C-4.05806818 265.85954169 -7.10630139 263.94341231 -10.3828125 262.19921875 C-17.17689883 258.41989963 -20.3025923 254.36480152 -23.65625 247.57421875 C-24.07954086 246.74327194 -24.50283173 245.91232513 -24.93894958 245.05619812 C-25.84060721 243.28355992 -26.73678933 241.50812755 -27.62789917 239.73016357 C-28.98743403 237.02500338 -30.36804389 234.33173422 -31.75610352 231.64111328 C-34.08314409 227.12555711 -36.38378405 222.59729505 -38.67163086 218.06176758 C-39.61009679 216.20674478 -40.55357817 214.35425197 -41.50170898 212.50415039 C-42.89950878 209.77543004 -44.28140098 207.03916363 -45.66015625 204.30078125 C-46.08297379 203.48297684 -46.50579132 202.66517242 -46.94142151 201.82258606 C-49.63339441 196.41939466 -52.18736639 191.09778 -50.41041565 184.96525574 C-49.48771834 182.74117905 -48.44283302 180.6303133 -47.328125 178.49609375 C-46.73723839 177.30689583 -46.73723839 177.30689583 -46.13441467 176.09367371 C-45.29205576 174.40457337 -44.44064854 172.71995984 -43.58096313 171.03961182 C-42.24134616 168.42058122 -40.92659985 165.79037181 -39.61791992 163.15576172 C-37.09884068 158.09354426 -34.55295291 153.045201 -32 148 C-29.75004807 143.55176574 -27.5209121 139.09402442 -25.3125 134.625 C-24.86229492 133.75544678 -24.41208984 132.88589355 -23.94824219 131.98999023 C-20.3847989 124.77178864 -20.64363195 119.14921491 -21.50805664 111.30859375 C-22.00523985 106.37598981 -22.17694341 101.4942693 -22.203125 96.5390625 C-22.20882507 95.66841156 -22.21452515 94.79776062 -22.22039795 93.90072632 C-22.22977612 92.06713039 -22.23635302 90.23351815 -22.24023438 88.39990234 C-22.24985563 85.66602138 -22.28091362 82.93292146 -22.3125 80.19921875 C-22.47385076 53.21896951 -17.69678835 25.49333588 -2 3 C-1.34 2.01 -0.68 1.02 0 0 Z" fill="#FF0000" transform="translate(51,0)"/>
      <path d="M0 0 C4.93893685 1.26115506 7.12585074 2.76780669 10.1875 6.8125 C11.37472656 8.28396484 11.37472656 8.28396484 12.5859375 9.78515625 C14.25691656 11.93592795 15.61615011 14.0186543 17.0390625 16.37109375 C22.16667861 24.30922505 27.11300337 26.72771833 36.32885742 28.90527344 C38.8129201 29.41713509 41.30722994 29.88207094 43.80981445 30.29394531 C53.162977 32.00927762 57.47388273 35.33142851 63 43 C63.86069092 44.14601685 63.86069092 44.14601685 64.73876953 45.31518555 C65.15497559 45.87117432 65.57118164 46.42716309 66 47 C66.61359375 46.07058594 67.2271875 45.14117187 67.859375 44.18359375 C74.93933176 34.64861554 81.39840299 31.77822792 93 29.5625 C104.62989972 27.28267828 110.87105686 24.45835675 117.6484375 14.68359375 C118.43432007 13.45702643 119.21832966 12.22925599 120 11 C121.29273181 9.21468451 122.60182952 7.44092274 123.9375 5.6875 C124.453125 5.00171875 124.96875 4.3159375 125.5 3.609375 C127.67141847 1.27962393 129.90838072 0.52783744 133 0 C134.53064071 1.53064071 134.27308146 2.9324149 134.36328125 5.0625 C134.29136964 10.49772976 132.30813112 13.68751526 129.1875 18 C124.5590517 24.4534261 124.5590517 24.4534261 121.0859375 31.5625 C118.63319123 37.24942585 116.07285897 42.13790641 110.18481445 44.82989502 C97.06273107 49.81885052 82.06390587 53.3283293 68 53 C65.77912269 53 63.55816656 53.03979726 61.33813477 53.10107422 C56.93260358 53.09592632 52.87306104 52.36160045 48.58984375 51.3828125 C47.81870743 51.20676483 47.04757111 51.03071716 46.25306702 50.84933472 C44.63412173 50.47316365 43.01648108 50.09133661 41.40014648 49.70410156 C39.76058316 49.31855143 38.11685369 48.95030113 36.46948242 48.59960938 C21.03348607 45.31135883 21.03348607 45.31135883 16.87109375 39.4609375 C15.87903506 37.65947533 14.92352289 35.83753963 14 34 C12.70560976 31.93810112 11.3949582 29.88634317 10.0703125 27.84375 C8.75240434 25.73091311 7.43732081 23.61631182 6.125 21.5 C5.44953125 20.4171875 4.7740625 19.334375 4.078125 18.21875 C-2.36661012 7.86576186 -2.36661012 7.86576186 -2 2 C-1.34 1.34 -0.68 0.68 0 0 Z" fill="#FF0000" transform="translate(82,293)"/>
    </g>
  </svg>
);

/*
   GLOBAL STYLES
 */
const style = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');

  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

  :root {
    --red: #e02020;
    --red-dark: #a00000;
    --red-glow: rgba(200,0,0,0.35);
  }

  html { scroll-behavior: smooth; }

  .ye-root {
    background: #070707;
    color: #fff;
    font-family: 'Montserrat', sans-serif;
    overflow-x: hidden;
    min-height: 100vh;
  }

  /* BG */
  .bg-fixed { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
  .bg-orb { position: absolute; border-radius: 50%; will-change: transform; }
  .orb1 {
    width:700px; height:700px;
    background: radial-gradient(circle, rgba(200,0,0,0.18) 0%, transparent 70%);
    top:-200px; right:-150px;
    animation: orbFloatA 20s ease-in-out infinite;
  }
  .orb2 {
    width:500px; height:500px;
    background: radial-gradient(circle, rgba(150,0,0,0.12) 0%, transparent 70%);
    bottom:100px; left:-150px;
    animation: orbFloatB 26s ease-in-out infinite;
  }
  .bg-grid {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
    background-size: 56px 56px;
    will-change: transform;
    animation: gridPan 36s linear infinite;
  }
  @keyframes orbFloatA {
    0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
    50% { transform: translate3d(-24px, 20px, 0) scale(1.05); }
  }
  @keyframes orbFloatB {
    0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
    50% { transform: translate3d(28px, -18px, 0) scale(1.04); }
  }
  @keyframes gridPan {
    0% { transform: translate3d(0, 0, 0); }
    100% { transform: translate3d(56px, 56px, 0); }
  }

  /* SECTION DIVIDER */
  .sec-divider {
    position: relative; z-index: 1;
    display: flex; align-items: center;
    padding: 0 3rem; overflow: hidden;
  }
  .sec-divider-line {
    flex: 1; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(200,0,0,0.5), rgba(255,255,255,0.08), transparent);
  }
  .sec-divider-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--red);
    box-shadow: 0 0 12px var(--red), 0 0 24px rgba(200,0,0,0.4);
    flex-shrink: 0; margin: 0 12px;
  }
  .sec-divider-label {
    font-family: 'Space Mono', monospace;
    font-size: 9px; letter-spacing: 3px;
    color: rgba(200,0,0,0.55);
    flex-shrink: 0; margin: 0 16px;
  }

  /* NAVBAR */
  .nav {
    position: sticky; top: 0; z-index: 200;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 3rem; height: 62px;
    background: rgba(7,7,7,0.88);
    backdrop-filter: blur(24px);
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .nav-logo {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 26px; letter-spacing: 2px;
    color: #fff; text-decoration: none;
  }
  .nav-logo span { color: var(--red); }
  .nav-links { display: flex; gap: 2rem; list-style: none; }
  .nav-links a {
    font-family: 'Space Mono', monospace;
    font-size: 10px; letter-spacing: 2px;
    color: rgba(255,255,255,0.4); text-decoration: none;
    transition: color 0.2s; padding-bottom: 3px;
  }
  .nav-links a:hover, .nav-links a.active { color: #fff; }
  .nav-links a.active { border-bottom: 1.5px solid var(--red); }
  .nav-right { display: flex; gap: 8px; align-items: center; }

  .back-home-btn {
    position: fixed;
    top: 76px;
    left: 16px;
    z-index: 55;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 1.4px;
    color: rgba(255,255,255,0.78);
    background: rgba(0,0,0,0.72);
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 999px;
    padding: 8px 13px;
    backdrop-filter: blur(10px);
    transition: all 0.2s ease;
  }
  .back-home-btn:hover {
    color: #fff;
    border-color: rgba(200,0,0,0.45);
    background: rgba(200,0,0,0.14);
  }
  .back-home-btn .arr {
    color: var(--red);
    font-size: 13px;
    line-height: 1;
  }
  .hamburger {
    display: none;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.04);
    border-radius: 8px;
    cursor: pointer;
  }
  .hamburger .bar {
    display:block;
    width:18px;
    height:2px;
    background:#fff;
    margin:3px 0;
    transition: transform 0.25s ease, opacity 0.2s ease;
  }
  .hamburger.is-active .bar:nth-child(1) { transform: translateY(6px) rotate(45deg); }
  .hamburger.is-active .bar:nth-child(2) { opacity: 0; }
  .hamburger.is-active .bar:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

  .mobile-menu {
    display: none;
    position: fixed;
    inset: 62px 0 0 0;
    z-index: 300;
    background: rgba(7,7,7,0.96);
    backdrop-filter: blur(10px);
    padding: 2rem 1.5rem;
    transition: opacity 0.22s ease, transform 0.22s ease;
    opacity: 0;
    pointer-events: none;
  }
  .mobile-menu.open {
    display: block;
    opacity: 1;
    pointer-events: auto;
  }
  .mobile-menu ul { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:12px; }
  .mobile-menu a { font-family: 'Space Mono', monospace; font-size: 16px; color: #fff; text-decoration:none; padding: 12px 8px; border-radius: 8px; display:block; }
  .mobile-menu a.active { color: var(--red); background: rgba(200,0,0,0.06); }

  /* HERO */
  .hero {
    position: relative; z-index: 1;
    min-height: 92vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center;
    padding: 6rem 2rem 5rem;
  }
  @keyframes heroRise {
    0% { opacity: 0; transform: translate3d(0, 24px, 0) scale(0.985); }
    100% { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
  }
  @keyframes heroFadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  .hero-logo-wrap {
    width: 140px;
    margin: 0 auto 2rem;
    display: flex; align-items: center; justify-content: center;
    background: none; border: none; outline: none;
    overflow: visible;
    animation: heroRise 850ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .hero-logo-wrap svg {
    overflow: visible;
    animation: logoGlow 2.8s ease-in-out infinite;
  }
  @keyframes logoGlow {
    0%,100% { filter: drop-shadow(0 0 10px rgba(255,0,0,0.5)) drop-shadow(0 0 22px rgba(255,0,0,0.25)); }
    50% { filter: drop-shadow(0 0 22px rgba(255,0,0,0.9)) drop-shadow(0 0 48px rgba(255,0,0,0.45)); }
  }
  @keyframes pulse {
    0%,100% { box-shadow: 0 0 30px rgba(200,0,0,0.18); }
    50% { box-shadow: 0 0 55px rgba(200,0,0,0.38); }
  }
  .hero-eyebrow {
    display: inline-flex; align-items: center; gap: 10px;
    font-family: 'Space Mono', monospace;
    font-size: 9px; letter-spacing: 4px; color: var(--red);
    margin-bottom: 1.6rem;
    animation: heroRise 850ms cubic-bezier(0.22, 1, 0.36, 1) 120ms both;
  }
  .hero-eyebrow::before,.hero-eyebrow::after {
    content: ''; width: 28px; height: 1px;
    background: var(--red); opacity: 0.45;
  }
  .hero-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(58px, 11vw, 110px);
    line-height: 0.93; letter-spacing: 2px;
    margin-bottom: 1.6rem;
    animation: heroRise 850ms cubic-bezier(0.22, 1, 0.36, 1) 220ms both;
  }
  .hero-title .red {
    color: var(--red);
    text-shadow: 0 0 70px rgba(200,0,0,0.5);
    display: block;
  }
  .hero-sub {
    font-size: 15px; font-weight: 300;
    color: rgba(255,255,255,0.42);
    max-width: 480px; line-height: 1.75;
    margin: 0 auto 2.8rem;
    animation: heroRise 850ms cubic-bezier(0.22, 1, 0.36, 1) 340ms both;
  }
  .email-bar {
    display: flex; max-width: 480px; width: 100%;
    margin: 0 auto;
    border-radius: 12px; overflow: hidden;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    backdrop-filter: blur(12px);
  }
  .email-bar input {
    flex: 1; background: none; border: none;
    color: #fff; padding: 14px 20px;
    font-size: 13px; font-family: 'Montserrat', sans-serif;
    outline: none;
  }
  .email-bar input::placeholder { color: rgba(255,255,255,0.22); }
  .email-bar button {
    background: linear-gradient(135deg, var(--red-dark), var(--red));
    color: #fff; border: none;
    padding: 14px 28px; font-weight: 700;
    font-family: 'Space Mono', monospace;
    font-size: 11px; letter-spacing: 1.5px; cursor: pointer;
  }
  .hero-trust {
    display: flex; gap: 2.5rem; justify-content: center;
    margin-top: 1.2rem;
    font-family: 'Space Mono', monospace;
    font-size: 10px; color: rgba(255,255,255,0.25);
  }
  .hero-trust span::before { content: '* '; color: var(--red); font-size: 8px; }
  .scroll-hint {
    position: absolute; bottom: 2.2rem; left: 50%; transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    font-family: 'Space Mono', monospace;
    font-size: 9px; letter-spacing: 2.5px; color: rgba(255,255,255,0.18);
    animation: heroFadeIn 900ms ease 620ms both;
  }
  .scroll-line {
    width: 1px; height: 42px;
    background: linear-gradient(to bottom, rgba(200,0,0,0.5), transparent);
  }

  /* SECTION COMMON */
  section { position: relative; z-index: 1; padding: 5.5rem 3rem; }
  .reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 520ms cubic-bezier(0.22, 1, 0.36, 1), transform 520ms cubic-bezier(0.22, 1, 0.36, 1);
    will-change: opacity, transform;
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .wipe {
    display: inline-block;
    clip-path: inset(0 100% 0 0);
    transition: clip-path 620ms cubic-bezier(0.22, 1, 0.36, 1);
    will-change: clip-path;
  }
  .wipe.visible {
    clip-path: inset(0 0 0 0);
  }
  .card {
    opacity: 0;
    transform: scale(0.05) translateY(60px);
    transition:
      opacity 640ms cubic-bezier(0.34, 1.56, 0.64, 1),
      transform 640ms cubic-bezier(0.34, 1.56, 0.64, 1);
    transition-delay: var(--card-delay, 0ms);
    transform-origin: center bottom;
    will-change: opacity, transform;
  }
  .card.visible {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  .sec-label {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: 'Space Mono', monospace;
    font-size: 9px; letter-spacing: 3.5px; color: var(--red);
    margin-bottom: 1.2rem;
  }
  .sec-label::before {
    content: ''; width: 6px; height: 6px;
    background: var(--red); border-radius: 50%;
    box-shadow: 0 0 8px var(--red);
  }
  .sec-h2 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(38px, 6vw, 68px);
    letter-spacing: 1.5px; line-height: 1;
  }
  .sec-h2 .red { color: var(--red); text-shadow: 0 0 40px rgba(200,0,0,0.4); }

  /* ABOUT */
  .about-inner {
    border-radius: 24px; padding: 4rem;
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 4rem; align-items: center;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    backdrop-filter: blur(18px);
  }
  .about-body {
    font-size: 14px; color: rgba(255,255,255,0.48);
    line-height: 1.85; margin-top: 1.2rem; font-weight: 300;
  }
  .quote-card {
    border-radius: 20px; padding: 2.8rem;
    background: rgba(200,0,0,0.07);
    border: 1px solid rgba(200,0,0,0.2);
    backdrop-filter: blur(18px);
  }
  .quote-mark {
    font-size: 96px; color: rgba(200,0,0,0.14);
    line-height: 0.8; font-family: Georgia, serif;
    margin-bottom: 1rem;
  }
  .quote-text { font-size: 15px; font-style: italic; color: rgba(255,255,255,0.65); line-height: 1.75; }
  .quote-attr {
    font-family: 'Space Mono', monospace;
    font-size: 9px; letter-spacing: 3px; color: var(--red);
    margin-top: 1.5rem;
    display: flex; align-items: center; gap: 10px;
  }
  .quote-attr::before { content: ''; width: 24px; height: 1px; background: var(--red); }

  /* ROSTER + CREATORS SHARED */
  .roster-header {
    display: flex; justify-content: space-between;
    align-items: flex-end; margin-bottom: 2rem;
  }
  .game-selector { display: flex; gap: 10px; margin-bottom: 2.4rem; flex-wrap: wrap; }
  .game-tab {
    font-family: 'Space Mono', monospace;
    font-size: 10px; letter-spacing: 2px; font-weight: 700;
    padding: 9px 22px; border-radius: 30px;
    cursor: pointer; transition: all 0.2s;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.4);
  }
  .game-tab.active {
    background: linear-gradient(135deg, var(--red-dark), var(--red));
    border-color: transparent; color: #fff;
    box-shadow: 0 0 22px rgba(200,0,0,0.32);
  }
  .game-tab:hover:not(.active) { border-color: rgba(200,0,0,0.35); color: rgba(255,255,255,0.75); }
  .active-badge {
    display: flex; align-items: center; gap: 7px;
    font-family: 'Space Mono', monospace;
    font-size: 10px; color: rgba(255,255,255,0.45);
  }
  .active-badge::before {
    content: ''; width: 7px; height: 7px;
    background: #00e676; border-radius: 50%;
    box-shadow: 0 0 8px #00e676;
  }
  .roster-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.6rem;
  }

  /* Cinematic player / creator card */
  .player-card {
    border-radius: 20px;
    position: relative; overflow: hidden;
    transition:
      opacity 640ms cubic-bezier(0.34, 1.56, 0.64, 1),
      transform 640ms cubic-bezier(0.34, 1.56, 0.64, 1),
      box-shadow 0.34s cubic-bezier(0.22, 1, 0.36, 1);
    transition-delay: var(--card-delay, 0ms);
    cursor: default;
    display: flex; flex-direction: column;
  }
  .player-card.featured {
    background: #0f0f0f;
    border: 1px solid rgba(200,0,0,0.22);
  }
  .player-card.standard {
    background: #0c0c0c;
    border: 1px solid rgba(255,255,255,0.08);
  }
  .player-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 28px 64px rgba(200,0,0,0.18);
  }

  /* Image area - big cinematic zone */
  .pc-img-area {
    position: relative;
    width: 100%; height: 290px;
    overflow: hidden; flex-shrink: 0;
  }
  .pc-img-area img {
    width: 100%; height: 100%;
    object-fit: cover; object-position: top center;
    display: block;
    filter: sepia(0.06) contrast(1.05);
    transition: transform 0.4s ease;
  }
  .player-card:hover .pc-img-area img { transform: scale(1.04); }
  .pc-img-placeholder {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(160deg, rgba(200,0,0,0.07) 0%, rgba(0,0,0,0.5) 100%);
    font-family: 'Bebas Neue', sans-serif;
    font-size: 90px; letter-spacing: -4px; line-height: 1;
    color: rgba(255,255,255,0.035); user-select: none;
  }
  /* Gradient that blends the image into the card body */
  .pc-img-area::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(
      to bottom,
      transparent 30%,
      rgba(0,0,0,0.45) 68%,
      rgba(12,12,12,1) 100%
    );
    pointer-events: none;
  }
  .featured .pc-img-area::after {
    background: linear-gradient(
      to bottom,
      transparent 30%,
      rgba(0,0,0,0.45) 68%,
      rgba(15,15,15,1) 100%
    );
  }
  /* Ghost number watermark */
  .pc-num {
    position: absolute; right: 6px; top: 2px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 136px; line-height: 1;
    color: rgba(255,255,255,0.038);
    pointer-events: none; z-index: 2;
    letter-spacing: -6px;
  }
  .featured .pc-num { color: rgba(200,0,0,0.065); }
  /* Top-left badge row on image */
  .pc-badge-row {
    position: absolute; top: 14px; left: 14px;
    display: flex; gap: 6px; z-index: 3;
  }
  .game-badge {
    font-family: 'Space Mono', monospace;
    font-size: 8px; letter-spacing: 1.5px;
    color: rgba(255,255,255,0.7);
    background: rgba(0,0,0,0.65);
    border: 1px solid rgba(255,255,255,0.14);
    padding: 3px 10px; border-radius: 4px;
    backdrop-filter: blur(6px);
  }
  /* Info section below image */
  .pc-info {
    padding: 0.75rem 1.4rem 1.3rem;
    display: flex; flex-direction: column;
    flex: 1;
  }
  .pc-top-row {
    display: flex; justify-content: space-between; align-items: baseline;
    margin-bottom: 0.1rem;
  }
  .pc-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 30px; letter-spacing: 1px; line-height: 1; color: #fff;
  }
  .pc-country { font-family: 'Space Mono', monospace; font-size: 10px; color: rgba(255,255,255,0.35); }
  .pc-real { font-size: 11px; color: rgba(255,255,255,0.28); margin-bottom: 0.65rem; }
  .pc-role {
    display: inline-block;
    font-family: 'Space Mono', monospace;
    font-size: 8px; letter-spacing: 2px; font-weight: 700;
    color: #ff5555;
    background: rgba(200,0,0,0.12);
    border: 1px solid rgba(200,0,0,0.25);
    padding: 4px 12px; border-radius: 4px;
    margin-bottom: 1rem; width: fit-content;
  }
  .pc-view {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: 'Space Mono', monospace;
    font-size: 10px; letter-spacing: 1px;
    color: rgba(255,255,255,0.28);
    text-decoration: none;
    transition: color 0.2s; margin-top: auto;
  }
  .pc-view:hover { color: var(--red); }

  /* SHOP */
  .coming-soon-wrap {
    margin-top: 3.5rem;
    border-radius: 24px;
    background: rgba(255,255,255,0.03);
    border: 1px dashed rgba(200,0,0,0.3);
    backdrop-filter: blur(18px);
    overflow: hidden;
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    align-items: stretch;
  }
  @media (max-width: 900px) {
    .coming-soon-wrap { grid-template-columns: 1fr; }
  }
  .cs-img-box {
    border-right: 1px dashed rgba(200,0,0,0.3);
    position: relative;
    overflow: hidden;
  }
  @media (max-width: 900px) {
    .cs-img-box { border-right: none; border-bottom: 1px dashed rgba(200,0,0,0.3); }
  }
  .cs-img-box img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    filter: saturate(1.1) contrast(1.1);
    transition: transform 0.5s ease;
  }
  .cs-img-box img:hover {
    transform: scale(1.05);
  }
  .cs-content {
    padding: 5rem 3rem;
    text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 1.2rem;
    justify-content: center;
  }
  .cs-icon {
    width: 72px; height: 72px; border-radius: 50%;
    background: rgba(200,0,0,0.08);
    border: 1px solid rgba(200,0,0,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 28px;
    box-shadow: 0 0 30px rgba(200,0,0,0.12);
  }
  .cs-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(32px,5vw,58px); letter-spacing: 3px;
    color: var(--red); text-shadow: 0 0 50px rgba(200,0,0,0.35);
  }
  .cs-sub { font-size: 13px; color: rgba(255,255,255,0.32); max-width: 420px; line-height: 1.75; font-weight: 300; }
  .cs-badge {
    font-family: 'Space Mono', monospace;
    font-size: 9px; letter-spacing: 3px;
    color: rgba(200,0,0,0.7);
    border: 1px solid rgba(200,0,0,0.25);
    background: rgba(200,0,0,0.07);
    padding: 6px 20px; border-radius: 30px;
    margin-top: 0.4rem;
  }

  /* CONTACT */
  .contact-inner {
    border-radius: 24px; padding: 4rem;
    display: grid; grid-template-columns: 1fr 1.4fr;
    gap: 4rem;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    backdrop-filter: blur(18px);
  }
  .contact-sub { font-size: 13px; color: rgba(255,255,255,0.38); margin-top: 0.8rem; line-height: 1.75; font-weight: 300; }
  .dept-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 1.6rem; margin-bottom: 2rem; }
  .dept-btn {
    border-radius: 10px; padding: 12px 14px;
    cursor: pointer; transition: all 0.2s; text-align: left;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
  }
  .dept-btn.active, .dept-btn:hover { background: rgba(200,0,0,0.09); border-color: rgba(200,0,0,0.28); }
  .dept-title { font-family: 'Space Mono', monospace; font-size: 9px; font-weight: 700; letter-spacing: 1px; color: #fff; }
  .dept-desc { font-size: 11px; color: rgba(255,255,255,0.3); margin-top: 3px; }
  .info-list { margin-top: 1.5rem; display: flex; flex-direction: column; gap: 10px; }
  .info-item {
    display: flex; align-items: center; gap: 14px;
    padding: 13px 15px; border-radius: 12px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
  }
  .info-icon {
    width: 38px; height: 38px; border-radius: 8px;
    background: rgba(200,0,0,0.14);
    border: 1px solid rgba(200,0,0,0.22);
    display: flex; align-items: center; justify-content: center;
    color: #ff6666;
    flex-shrink: 0;
  }
  .info-icon svg { width: 18px; height: 18px; display: block; }
  .info-label { font-family: 'Space Mono', monospace; font-size: 9px; letter-spacing: 1.5px; color: rgba(255,255,255,0.28); }
  .info-val { font-size: 13px; color: rgba(255,255,255,0.75); margin-top: 2px; }
  .follow-label { font-family: 'Space Mono', monospace; font-size: 9px; letter-spacing: 2px; color: rgba(255,255,255,0.28); margin-top: 1.6rem; margin-bottom: 0.8rem; }
  .socials { display: flex; gap: 9px; }
  .social-btn {
    width: 36px; height: 36px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Space Mono', monospace;
    font-size: 11px; cursor: pointer;
    color: rgba(255,255,255,0.45);
    transition: all 0.2s; text-decoration: none;
  }
  .social-icon { width: 18px; height: 18px; display: block; }
  .social-btn:hover { border-color: rgba(200,0,0,0.4); color: var(--red); }
  .form-grid { display: flex; flex-direction: column; gap: 12px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .finput {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 10px; padding: 13px 16px;
    color: #fff; font-size: 13px;
    font-family: 'Montserrat', sans-serif;
    outline: none; transition: border-color 0.2s;
  }
  .finput:focus { border-color: rgba(200,0,0,0.4); }
  .finput::placeholder { color: rgba(255,255,255,0.18); }
  textarea.finput { resize: vertical; min-height: 120px; }
  .send-btn {
    width: 100%;
    background: linear-gradient(135deg, var(--red-dark), var(--red));
    color: #fff; border: none; padding: 16px;
    border-radius: 10px; font-weight: 700;
    font-family: 'Space Mono', monospace;
    font-size: 11px; letter-spacing: 2px; cursor: pointer;
    box-shadow: 0 0 28px rgba(200,0,0,0.22);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .send-btn:hover { transform: translateY(-2px); box-shadow: 0 0 48px rgba(200,0,0,0.4); }
  .form-note { font-size: 11px; color: rgba(255,255,255,0.18); text-align: center; }
  .resp-badge {
    display: flex; align-items: center; gap: 12px;
    padding: 13px 17px; border-radius: 10px;
    background: rgba(0,200,120,0.07);
    border: 1px solid rgba(0,200,120,0.18);
    margin-top: 1.5rem;
  }
  .resp-icon {
    width: 32px; height: 32px; border-radius: 50%;
    background: rgba(0,200,120,0.14);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; color: #00c878;
  }
  .rb-label { font-family: 'Space Mono', monospace; font-size: 9px; letter-spacing: 1.5px; color: rgba(255,255,255,0.28); }
  .rb-val { font-size: 12px; color: #00c878; font-weight: 700; }

  /* FOOTER */
  footer {
    position: relative; z-index: 1;
    background: rgba(0,0,0,0.65);
    backdrop-filter: blur(24px);
    border-top: 1px solid rgba(255,255,255,0.06);
    padding: 3rem;
    display: grid; grid-template-columns: repeat(4,1fr); gap: 2rem;
  }
  footer h4 {
    font-family: 'Space Mono', monospace;
    font-size: 9px; letter-spacing: 2.5px; color: rgba(255,255,255,0.45);
    margin-bottom: 1.2rem;
    display: flex; align-items: center; gap: 7px;
  }
  footer h4::before { content: ''; width: 5px; height: 5px; background: var(--red); border-radius: 50%; box-shadow: 0 0 6px var(--red); }
  footer a { display: block; font-size: 13px; color: rgba(255,255,255,0.32); text-decoration: none; margin-bottom: 9px; transition: color 0.2s; }
  footer a:hover { color: var(--red); }
  .footer-hq { font-size: 13px; color: rgba(255,255,255,0.32); line-height: 1.85; }
  .footer-hq strong { color: rgba(255,255,255,0.6); }
  .footer-socials { display: flex; gap: 7px; margin-top: 0.5rem; flex-wrap: wrap; }
  .footer-social {
    width: 34px; height: 34px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Space Mono', monospace;
    font-size: 10px; color: rgba(255,255,255,0.38);
    text-decoration: none; transition: all 0.2s;
  }
  .footer-social .social-icon { width: 15px; height: 15px; }
  .footer-social:hover { border-color: rgba(200,0,0,0.4); color: var(--red); }
  .footer-bottom {
    position: relative; z-index: 1;
    background: rgba(0,0,0,0.78);
    border-top: 1px solid rgba(255,255,255,0.04);
    padding: 1.2rem 3rem;
    display: flex; justify-content: space-between; align-items: center;
    font-family: 'Space Mono', monospace;
    font-size: 10px; letter-spacing: 1.5px;
    color: rgba(255,255,255,0.18);
  }
  .footer-bottom .accent { color: var(--red); }
  .admin-open-btn {
    background: none;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 6px;
    cursor: pointer;
    color: rgba(255,255,255,0.25);
    font-size: 13px;
    padding: 4px 9px;
    line-height: 1;
    transition: all 0.2s;
  }
  .admin-open-btn:hover {
    border-color: rgba(200,0,0,0.4);
    color: rgba(200,0,0,0.7);
  }

  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    .orb1, .orb2, .bg-grid,
    .hero-logo-wrap, .hero-logo-wrap svg, .hero-eyebrow, .hero-title, .hero-sub, .scroll-hint {
      animation: none !important;
    }
    .card, .card.visible,
    .reveal, .reveal.visible,
    .wipe, .wipe.visible {
      opacity: 1 !important;
      transform: none !important;
      transition: none !important;
      clip-path: inset(0 0 0 0) !important;
    }
  }

  @media (max-width: 900px) {
    .nav { padding: 0 1.5rem; }
    .nav-links { display: none; }
    .hamburger { display: inline-flex; }
    .back-home-btn { top: 72px; left: 12px; }
    section { padding: 4rem 1.5rem; }
    .about-inner, .contact-inner { grid-template-columns: 1fr; gap: 2rem; padding: 2rem; }
    footer { grid-template-columns: 1fr 1fr; padding: 2rem 1.5rem; }
    .sec-divider { padding: 0 1.5rem; }
  }
  @media (max-width: 600px) {
    .roster-grid { grid-template-columns: 1fr; }
    footer { grid-template-columns: 1fr; }
    .form-row { grid-template-columns: 1fr; }
    .dept-grid { grid-template-columns: 1fr; }
  }
`;

/* 
   ADMIN PANEL STYLES
 */
const adminStyle = `
  .admin-overlay {
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(0,0,0,0.9); backdrop-filter: blur(12px);
    display: flex; align-items: center; justify-content: center;
    padding: 1rem;
  }
  .admin-panel {
    background: #0d0d0d;
    border: 1px solid rgba(200,0,0,0.3);
    border-radius: 20px; padding: 2rem;
    width: 100%; max-width: 800px;
    max-height: 90vh; overflow-y: auto;
    position: relative;
  }
  .admin-panel::-webkit-scrollbar { width: 4px; }
  .admin-panel::-webkit-scrollbar-thumb { background: rgba(200,0,0,0.4); border-radius: 4px; }
  .admin-panel h3 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 28px; letter-spacing: 2px; color: #fff;
    margin-bottom: 0.3rem;
  }
  .admin-panel .panel-sub {
    font-family: 'Space Mono', monospace;
    font-size: 9px; letter-spacing: 2px; color: rgba(200,0,0,0.6);
    margin-bottom: 1.5rem;
  }
  .admin-close {
    position: absolute; top: 1.2rem; right: 1.2rem;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px; width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: rgba(255,255,255,0.5); font-size: 14px;
    transition: all 0.2s;
  }
  .admin-close:hover { border-color: rgba(200,0,0,0.4); color: var(--red); }
  .admin-login { display: flex; flex-direction: column; gap: 12px; max-width: 320px; margin: 0 auto; padding-top: 1rem; }
  .admin-login p { font-size: 13px; color: rgba(255,255,255,0.4); text-align: center; margin-bottom: 0.5rem; }
  .admin-login input {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px; padding: 12px 16px;
    color: #fff; font-size: 13px; font-family: 'Montserrat', sans-serif;
    outline: none; transition: border-color 0.2s;
  }
  .admin-login input:focus { border-color: rgba(200,0,0,0.4); }
  .admin-login input::placeholder { color: rgba(255,255,255,0.2); }
  .admin-err { font-size: 12px; color: #ff5555; text-align: center; }
  .admin-login button {
    background: linear-gradient(135deg, #a00000, #e02020);
    color: #fff; border: none; padding: 13px;
    border-radius: 10px; font-weight: 700;
    font-family: 'Space Mono', monospace;
    font-size: 11px; letter-spacing: 2px; cursor: pointer;
  }
  .admin-tabs { display: flex; gap: 8px; margin-bottom: 1.4rem; flex-wrap: wrap; }
  .admin-tab {
    font-family: 'Space Mono', monospace;
    font-size: 10px; letter-spacing: 1.5px; padding: 8px 20px;
    border-radius: 20px; cursor: pointer; transition: all 0.2s;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09); color: rgba(255,255,255,0.4);
  }
  .admin-tab.active {
    background: linear-gradient(135deg, #a00000, #e02020);
    border-color: transparent; color: #fff;
  }
  .admin-player-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px; padding: 1.2rem;
    margin-bottom: 10px;
  }
  .admin-player-header {
    display: flex; justify-content: space-between;
    align-items: center; margin-bottom: 1rem;
    font-family: 'Space Mono', monospace;
    font-size: 10px; letter-spacing: 1.5px; color: rgba(255,255,255,0.45);
  }
  .admin-remove-btn {
    background: rgba(200,0,0,0.1);
    border: 1px solid rgba(200,0,0,0.2);
    border-radius: 6px;
    cursor: pointer; color: rgba(255,80,80,0.7);
    font-family: 'Space Mono', monospace;
    font-size: 9px; letter-spacing: 1px;
    padding: 4px 10px; transition: all 0.2s;
  }
  .admin-remove-btn:hover { background: rgba(200,0,0,0.2); color: #ff5555; border-color: rgba(200,0,0,0.4); }
  .admin-card-top {
    display: flex; gap: 1rem; align-items: flex-start; margin-bottom: 0.8rem;
  }
  .admin-img-preview {
    width: 76px; height: 76px; border-radius: 12px; flex-shrink: 0;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    overflow: hidden; display: flex; align-items: center; justify-content: center;
    font-size: 28px; color: rgba(255,255,255,0.2);
  }
  .admin-img-preview img { width: 100%; height: 100%; object-fit: cover; }
  .admin-img-controls { flex: 1; display: flex; flex-direction: column; gap: 6px; justify-content: center; }
  .admin-img-btn {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px; padding: 8px 14px;
    color: rgba(255,255,255,0.6); font-size: 11px;
    font-family: 'Space Mono', monospace; letter-spacing: 1px;
    cursor: pointer; transition: all 0.2s; width: fit-content;
  }
  .admin-img-btn:hover { border-color: rgba(200,0,0,0.4); color: var(--red); }
  .admin-img-remove {
    background: none; border: none;
    color: rgba(255,80,80,0.5); font-size: 10px;
    font-family: 'Space Mono', monospace; letter-spacing: 1px;
    cursor: pointer; padding: 2px 0;
    transition: color 0.2s;
  }
  .admin-img-remove:hover { color: #ff5555; }
  .admin-img-hint {
    font-family: 'Space Mono', monospace;
    font-size: 8px; letter-spacing: 1px;
    color: rgba(255,255,255,0.18); margin-top: 2px;
  }
  .admin-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .admin-field label {
    display: block;
    font-family: 'Space Mono', monospace;
    font-size: 8px; letter-spacing: 1.5px; color: rgba(200,0,0,0.6);
    margin-bottom: 5px;
  }
  .admin-field input, .admin-field select {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 8px; padding: 9px 12px;
    color: #fff; font-size: 12px; font-family: 'Montserrat', sans-serif;
    outline: none; transition: border-color 0.2s;
  }
  .admin-field select option { background: #111; color: #fff; }
  .admin-field input:focus, .admin-field select:focus { border-color: rgba(200,0,0,0.35); }
  .admin-add-btn {
    width: 100%; padding: 14px;
    background: rgba(200,0,0,0.06);
    border: 1px dashed rgba(200,0,0,0.28);
    border-radius: 12px; color: rgba(200,0,0,0.6);
    font-family: 'Space Mono', monospace;
    font-size: 10px; letter-spacing: 2px; cursor: pointer;
    transition: all 0.2s; margin-top: 8px;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .admin-add-btn:hover {
    background: rgba(200,0,0,0.12);
    border-color: rgba(200,0,0,0.5);
    color: #ff5555;
  }
  .admin-save-btn {
    width: 100%; margin-top: 1.5rem;
    background: linear-gradient(135deg, #a00000, #e02020);
    color: #fff; border: none; padding: 14px;
    border-radius: 10px; font-weight: 700;
    font-family: 'Space Mono', monospace;
    font-size: 11px; letter-spacing: 2px; cursor: pointer;
    box-shadow: 0 0 28px rgba(200,0,0,0.22);
    transition: box-shadow 0.2s;
  }
  .admin-save-btn:hover { box-shadow: 0 0 48px rgba(200,0,0,0.4); }
  .save-success {
    text-align: center; margin-top: 10px;
    font-family: 'Space Mono', monospace;
    font-size: 10px; letter-spacing: 1.5px; color: #00e676;
  }
`;

/* 
   CONSTANTS & DATA
 */
const SectionDivider = ({ label }) => (
  <div className="sec-divider">
    <div className="sec-divider-line" />
    <span className="sec-divider-label wipe">{label}</span>
    <div className="sec-divider-dot" />
    <div className="sec-divider-line" />
  </div>
);

const depts = [
  { title: "SPONSORSHIP", desc: "Brand & partnerships" },
  { title: "RECRUITMENT", desc: "Join the roster" },
  { title: "MEDIA & PRESS", desc: "Interviews & kits" },
  { title: "MERCHANDISE", desc: "Orders & returns" },
  { title: "TECHNICAL", desc: "Website & bugs" },
  { title: "FEEDBACK", desc: "Suggestions & ideas" },
];

/* 
   IMAGE UPLOAD HELPER  reusable in admin
 */
function ImgUploadBlock({ img, onUpload, onRemove }) {
  return (
    <div className="admin-card-top">
      <div className="admin-img-preview">
        {img ? <img src={img} alt="preview" /> : "IMG"}
      </div>
      <div className="admin-img-controls">
        <label className="admin-img-btn" style={{ cursor: "pointer" }}>
          UPLOAD PHOTO
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={e => {
              const file = e.target.files[0];
              if (!file) return;
              if (file.size > 6 * 1024 * 1024) { alert("Image must be under 6MB"); return; }
              const reader = new FileReader();
              reader.onload = ev => onUpload(ev.target.result);
              reader.readAsDataURL(file);
            }}
          />
        </label>
        {img && (
          <button className="admin-img-remove" onClick={onRemove}>REMOVE PHOTO</button>
        )}
        <div className="admin-img-hint">JPG, PNG, WEBP - MAX 6MB</div>
      </div>
    </div>
  );
}

/* 
   MAIN COMPONENT
 */
export default function YouEsports() {
  const [activeDept, setActiveDept] = useState(0);
  const [activeNav, setActiveNav] = useState(() => getPageFromHash());
  const [activeGame, setActiveGame] = useState("BGMI");
  const [subject, setSubject] = useState("");

  // Contact form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formStatus, setFormStatus] = useState(""); // "", "sending", "sent", "error"

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormStatus("sending");
    try {
      const res = await fetch("https://formsubmit.co/ajax/youesportsmail@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          phone: formPhone,
          subject: subject || "General Inquiry",
          department: depts[activeDept]?.title || "GENERAL",
          message: formMessage,
          _subject: `[YOU eSports] ${subject || depts[activeDept]?.title || "New Inquiry"}`,
          _template: "table",
        }),
      });
      if (res.ok) {
        setFormStatus("sent");
        setFormName(""); setFormEmail(""); setFormPhone(""); setFormMessage(""); setSubject("");
        setTimeout(() => setFormStatus(""), 5000);
      } else {
        setFormStatus("error");
        setTimeout(() => setFormStatus(""), 4000);
      }
    } catch {
      setFormStatus("error");
      setTimeout(() => setFormStatus(""), 4000);
    }
  };

  // Admin state
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [adminErr, setAdminErr] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminTab, setAdminTab] = useState("BGMI");
  const [adminSaved, setAdminSaved] = useState(false);
  const [adminOpErr, setAdminOpErr] = useState("");

  // Editable data
  const [roster, setRoster] = useState({ BGMI: [], Valorant: [] });
  const [creators, setCreators] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  /*  Fetch data from Supabase  */
  const fetchData = useCallback(async () => {
    setDataLoading(true);
    const [{ data: rosterRows }, { data: creatorRows }] = await Promise.all([
      supabase.from('roster').select('*').order('num'),
      supabase.from('creators').select('*').order('num'),
    ]);
    if (rosterRows) {
      const grouped = { BGMI: [], Valorant: [] };
      rosterRows.forEach(r => {
        if (grouped[r.game]) grouped[r.game].push({ id: r.id, num: r.num, name: r.name, real: r.real_name, role: r.role, featured: r.featured, img: r.img });
      });
      setRoster(grouped);
    }
    if (creatorRows) {
      setCreators(creatorRows.map(c => ({ id: c.id, num: c.num, name: c.name, handle: c.handle, platform: c.platform, type: c.type, featured: c.featured, img: c.img, link: c.link || "" })));
    }
    setDataLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Mobile menu state + keyboard/resize handlers
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 900 && menuOpen) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [menuOpen]);

  /*  Admin auth via Supabase Auth  */
  const handleAdminLogin = async () => {
    setAdminLoading(true); setAdminErr("");
    const { error } = await supabase.auth.signInWithPassword({ email: adminEmail, password: adminPass });
    setAdminLoading(false);
    if (error) setAdminErr("Incorrect credentials. Try again.");
    else { setAdminAuthed(true); setAdminErr(""); }
  };

  const closeAdmin = async () => {
    await supabase.auth.signOut();
    setAdminOpen(false); setAdminAuthed(false);
    setAdminEmail(""); setAdminPass(""); setAdminErr("");
  };

  /*  Roster helpers (Supabase)  */
  const updatePlayer = (game, id, field, value) =>
    setRoster(prev => ({ ...prev, [game]: prev[game].map(p => p.id === id ? { ...p, [field]: value } : p) }));

  const addPlayer = async (game) => {
    setAdminOpErr("");
    const num = String(roster[game].length + 1).padStart(2, "0");
    const { data, error } = await supabase.from('roster')
      .insert({ game, num, name: "New Player", real_name: "Real Name", role: "ROLE" })
      .select('id, num, name, real_name, role')
      .single();
    if (error) { setAdminOpErr("Add failed: " + error.message); return; }
    if (data) {
      setRoster(prev => ({ ...prev, [game]: [...prev[game], { id: data.id, num: data.num, name: data.name, real: data.real_name, role: data.role, featured: false, img: null }] }));
    }
  };

  const removePlayer = async (game, id) => {
    setAdminOpErr("");
    const { error } = await supabase.from('roster').delete().eq('id', id);
    if (error) { setAdminOpErr("Remove failed: " + error.message); return; }
    setRoster(prev => ({
      ...prev,
      [game]: prev[game].filter(p => p.id !== id).map((p, i) => ({ ...p, num: String(i + 1).padStart(2, "0") }))
    }));
  };

  /*  Creator helpers (Supabase)  */
  const updateCreator = (id, field, value) =>
    setCreators(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));

  const addCreator = async () => {
    setAdminOpErr("");
    const num = String(creators.length + 1).padStart(2, "0");
    const { data, error } = await supabase.from('creators')
      .insert({ num, name: "New Creator", handle: "@handle", platform: "YouTube", type: "CONTENT CREATOR" })
      .select('id, num, name, handle, platform, type')
      .single();
    if (error) { setAdminOpErr("Add failed: " + error.message); return; }
    if (data) {
      setCreators(prev => [...prev, { id: data.id, num: data.num, name: data.name, handle: data.handle, platform: data.platform, type: data.type, featured: false, img: null, link: "" }]);
    }
  };

  const removeCreator = async (id) => {
    setAdminOpErr("");
    const { error } = await supabase.from('creators').delete().eq('id', id);
    if (error) { setAdminOpErr("Remove failed: " + error.message); return; }
    setCreators(prev => prev.filter(c => c.id !== id).map((c, i) => ({ ...c, num: String(i + 1).padStart(2, "0") })));
  };

  const handleAdminSave = async () => {
    setAdminLoading(true); setAdminOpErr("");
    const allPlayers = [...(roster.BGMI || []), ...(roster.Valorant || [])];
    const rosterResults = await Promise.all(allPlayers.map(p => {
      const game = Object.keys(roster).find(g => roster[g].some(r => r.id === p.id));
      return supabase.from('roster').update({ game, num: p.num, name: p.name, real_name: p.real, role: p.role, img: p.img || null }).eq('id', p.id);
    }));
    const creatorResults = await Promise.all(creators.map(c =>
      supabase.from('creators').update({ num: c.num, name: c.name, handle: c.handle, platform: c.platform, type: c.type, img: c.img || null, link: c.link || null }).eq('id', c.id)
    ));
    const anyError = [...rosterResults, ...creatorResults].find(r => r.error);
    setAdminLoading(false);
    if (anyError) { setAdminOpErr("Save failed: " + anyError.error.message); return; }
    setAdminSaved(true);
    setTimeout(() => setAdminSaved(false), 2500);
  };

  /* Keep nav highlight in sync with section hash */
  useEffect(() => {
    const syncFromHash = () => {
      setActiveNav(getPageFromHash());
      setMenuOpen(false);
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => {
      window.removeEventListener("hashchange", syncFromHash);
    };
  }, []);

  // Make wheel scrolling feel faster and smoother on desktop devices.
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hasFinePointer = window.matchMedia("(pointer: fine)");
    if (prefersReducedMotion.matches || !hasFinePointer.matches) return;

    let rafId = 0;
    let currentY = window.scrollY;
    let targetY = window.scrollY;

    const clampY = (value) => {
      const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      return Math.max(0, Math.min(maxY, value));
    };

    const shouldBypassSmoothScroll = (eventTarget) => {
      let node = eventTarget instanceof Element ? eventTarget : null;
      while (node && node !== document.body) {
        const style = window.getComputedStyle(node);
        const canScrollY =
          (style.overflowY === "auto" || style.overflowY === "scroll") &&
          node.scrollHeight > node.clientHeight + 2;
        if (canScrollY) return true;
        node = node.parentElement;
      }
      return false;
    };

    const tick = () => {
      const delta = targetY - currentY;
      if (Math.abs(delta) < 0.4) {
        currentY = targetY;
        window.scrollTo(0, currentY);
        rafId = 0;
        return;
      }
      const ease = Math.min(0.28, 0.17 + Math.abs(delta) / 1200);
      currentY += delta * ease;
      window.scrollTo(0, currentY);
      rafId = window.requestAnimationFrame(tick);
    };

    const ensureTicking = () => {
      if (!rafId) rafId = window.requestAnimationFrame(tick);
    };

    const onWheel = (event) => {
      if (event.ctrlKey || shouldBypassSmoothScroll(event.target)) return;

      const verticalScroll = Math.abs(event.deltaY) >= Math.abs(event.deltaX);
      if (!verticalScroll) return;

      event.preventDefault();

      const direction = Math.sign(event.deltaY) || 1;
      const amplifiedDelta = event.deltaY * 1.45;
      const clampedMagnitude = Math.min(Math.max(Math.abs(amplifiedDelta), 34), 240);
      const adjustedDelta = direction * clampedMagnitude;
      targetY = clampY(targetY + adjustedDelta);
      ensureTicking();
    };

    const syncPosition = () => {
      if (rafId) return;
      currentY = window.scrollY;
      targetY = window.scrollY;
    };

    const onResize = () => {
      currentY = clampY(currentY);
      targetY = clampY(targetY);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", syncPosition, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", syncPosition);
      window.removeEventListener("resize", onResize);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  // Add .visible as elements enter the viewport (no animation library required).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = Array.from(
      document.querySelectorAll(".card:not(.visible), .reveal:not(.visible), .wipe:not(.visible)")
    );
    if (!targets.length) return;

    const cardGroups = new Map();
    targets.forEach((target) => {
      if (!target.classList.contains("card")) return;
      const parent = target.parentElement || document.body;
      if (!cardGroups.has(parent)) cardGroups.set(parent, []);
      cardGroups.get(parent).push(target);
    });

    cardGroups.forEach((cards) => {
      cards.forEach((card, index) => {
        card.style.setProperty("--card-delay", `${index * 120}ms`);
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          if (entry.target.classList.contains("reveal")) {
            entry.target.querySelectorAll(".wipe").forEach((node) => node.classList.add("visible"));
          }
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );

    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, [roster.BGMI.length, roster.Valorant.length, creators.length]);

  const handleDeptClick = (i) => { setActiveDept(i); setSubject(depts[i].title); };
  const players = roster[activeGame];
  const socialLinks = SOCIAL_LINKS.filter(s => s.href);

  /*  Shared card renderer  */
  const renderCard = (item, label, linkText) => (
    <div key={item.id} className={`player-card card ${item.featured ? "featured" : "standard"}`}>
      <div className="pc-img-area">
        {item.img
          ? <img src={item.img} alt={item.name} />
          : <div className="pc-img-placeholder">{item.num}</div>
        }
        <div className="pc-num">{item.num}</div>
        <div className="pc-badge-row">
          <span className="game-badge">{label}</span>
        </div>
      </div>
      <div className="pc-info">
        <div className="pc-top-row">
          <div className="pc-name">{item.name}</div>
          <div className="pc-country">IN</div>
        </div>
        <div className="pc-real">{item.real || item.handle}</div>
        <div className="pc-role">{item.role || item.type}</div>
        <a href={item.link || "#"} className="pc-view" target={item.link ? "_blank" : "_self"} rel="noopener noreferrer">{linkText} -&gt;</a>
      </div>
    </div>
  );

  return (
    <div className="ye-root">
      <style>{style}</style>
      <style>{adminStyle}</style>

      {/* BG */}
      <div className="bg-fixed">
        <div className="bg-orb orb1" />
        <div className="bg-orb orb2" />
      </div>
      <div className="bg-grid" />

      {/* NAV */}
      <nav className="nav">
        <a
          href={getPageHref("home")}
          className="nav-logo"
          style={{ display: "flex", alignItems: "center", width: "36px", height: "36px" }}
          onClick={() => { setActiveNav("home"); setMenuOpen(false); }}
        ><LogoSVG /></a>
        <ul className="nav-links">
          {SECTION_IDS.map(s => (
            <li key={s}>
              <a href={getPageHref(s)} className={activeNav === s ? "active" : ""} onClick={() => { setActiveNav(s); setMenuOpen(false); }}>
                {getNavLabel(s)}
              </a>
            </li>
          ))}
        </ul>
        <div className="nav-right">
          <button
            className={`hamburger ${menuOpen ? "is-active" : ""}`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(v => !v)}
          >
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </button>
        </div>
      </nav>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`} onClick={e => { if (e.target === e.currentTarget) setMenuOpen(false); }}>
        <ul>
          {SECTION_IDS.map(s => (
            <li key={s}>
              <a href={getPageHref(s)} className={activeNav === s ? "active" : ""} onClick={() => { setActiveNav(s); setMenuOpen(false); }}>
                {getNavLabel(s)}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* ADMIN OVERLAY */}
      {adminOpen && (
        <div className="admin-overlay" onClick={e => { if (e.target === e.currentTarget) closeAdmin(); }}>
          <div className="admin-panel">
            <button className="admin-close" onClick={closeAdmin}>X</button>
            <h3>ADMIN PANEL</h3>
            <div className="panel-sub">ROSTER & CREATORS MANAGEMENT - YOUESPORTS</div>

            {!adminAuthed ? (
              <div className="admin-login">
                <p>Sign in with your admin account</p>
                <input
                  type="email"
                  placeholder="Admin email"
                  value={adminEmail}
                  onChange={e => setAdminEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAdminLogin()}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={adminPass}
                  onChange={e => setAdminPass(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAdminLogin()}
                />
                {adminErr && <div className="admin-err">{adminErr}</div>}
                <button onClick={handleAdminLogin} disabled={adminLoading}>
                  {adminLoading ? "SIGNING IN..." : "UNLOCK"}
                </button>
              </div>
            ) : (
              <>
                {/* Tabs */}
                <div className="admin-tabs">
                  {["BGMI", "Valorant", "CREATORS"].map(t => (
                    <button key={t} className={`admin-tab ${adminTab === t ? "active" : ""}`} onClick={() => setAdminTab(t)}>{t}</button>
                  ))}
                </div>

                {/* Roster tabs */}
                {(adminTab === "BGMI" || adminTab === "Valorant") && (
                  <>
                    {roster[adminTab].map(p => (
                      <div key={p.id} className="admin-player-card">
                        <div className="admin-player-header">
                          <span>PLAYER #{p.num} - {p.name}</span>
                          <button className="admin-remove-btn" onClick={() => removePlayer(adminTab, p.id)}>REMOVE</button>
                        </div>
                        <ImgUploadBlock
                          img={p.img}
                          onUpload={v => updatePlayer(adminTab, p.id, "img", v)}
                          onRemove={() => updatePlayer(adminTab, p.id, "img", null)}
                        />
                        <div className="admin-fields">
                          <div className="admin-field">
                            <label>IGN / PLAYER NAME</label>
                            <input value={p.name} onChange={e => updatePlayer(adminTab, p.id, "name", e.target.value)} placeholder="Player name" />
                          </div>
                          <div className="admin-field">
                            <label>REAL NAME</label>
                            <input value={p.real} onChange={e => updatePlayer(adminTab, p.id, "real", e.target.value)} placeholder="Real name" />
                          </div>
                          <div className="admin-field" style={{ gridColumn: "1 / -1" }}>
                            <label>ROLE</label>
                            <input value={p.role} onChange={e => updatePlayer(adminTab, p.id, "role", e.target.value)} placeholder="e.g. ASSAULTER" />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button className="admin-add-btn" onClick={() => addPlayer(adminTab)}>+ ADD PLAYER SLOT</button>
                  </>
                )}

                {/* Creators tab */}
                {adminTab === "CREATORS" && (
                  <>
                    {creators.map(c => (
                      <div key={c.id} className="admin-player-card">
                        <div className="admin-player-header">
                          <span>CREATOR #{c.num} - {c.name}</span>
                          <button className="admin-remove-btn" onClick={() => removeCreator(c.id)}>REMOVE</button>
                        </div>
                        <ImgUploadBlock
                          img={c.img}
                          onUpload={v => updateCreator(c.id, "img", v)}
                          onRemove={() => updateCreator(c.id, "img", null)}
                        />
                        <div className="admin-fields">
                          <div className="admin-field">
                            <label>CREATOR NAME</label>
                            <input value={c.name} onChange={e => updateCreator(c.id, "name", e.target.value)} placeholder="Display name" />
                          </div>
                          <div className="admin-field">
                            <label>HANDLE / @USERNAME</label>
                            <input value={c.handle} onChange={e => updateCreator(c.id, "handle", e.target.value)} placeholder="@username" />
                          </div>
                          <div className="admin-field">
                            <label>PLATFORM</label>
                            <select value={c.platform} onChange={e => updateCreator(c.id, "platform", e.target.value)}>
                              <option>YouTube</option>
                              <option>Instagram</option>
                              <option>Twitch</option>
                              <option>TikTok</option>
                              <option>Twitter / X</option>
                            </select>
                          </div>
                          <div className="admin-field">
                            <label>CONTENT TYPE</label>
                            <input value={c.type} onChange={e => updateCreator(c.id, "type", e.target.value)} placeholder="e.g. GAMEPLAY" />
                          </div>
                          <div className="admin-field" style={{ gridColumn: "1 / -1" }}>
                            <label>CHANNEL / PROFILE LINK</label>
                            <input value={c.link || ""} onChange={e => updateCreator(c.id, "link", e.target.value)} placeholder="https://youtube.com/@channel" />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button className="admin-add-btn" onClick={addCreator}>+ ADD CREATOR SLOT</button>
                  </>
                )}

                <button className="admin-save-btn" onClick={handleAdminSave} disabled={adminLoading}>
                  {adminLoading ? "SAVING..." : "SAVE CHANGES"}
                </button>
                {adminSaved && <div className="save-success">CHANGES APPLIED SUCCESSFULLY</div>}
                {adminOpErr && <div className="admin-err" style={{ marginTop: "12px", textAlign: "center" }}>ERROR: {adminOpErr}</div>}
              </>
            )}
          </div>
        </div>
      )}

      {/* HERO */}
      <section id="home" className="hero">
        <div className="hero-logo-wrap">
          <LogoSVG />
        </div>
        <div className="hero-eyebrow">WELCOME TO YOUTOPIA</div>
        <h1 className="hero-title">
          YES YOU.
          <span className="red">CAN.</span>
        </h1>
        <p className="hero-sub">
          Priority access to limited apparel drops, private tournaments, and behind-the-scenes esports culture. Be first. Be inside.
        </p>

        <div className="scroll-hint">
          <div className="scroll-line" />
          SCROLL
        </div>
      </section>

      <SectionDivider label="ORIGINS" />
      {/* ABOUT */}
      <section id="about" className="reveal">
        <div className="about-inner card">
          <div>
            <div className="sec-label wipe">ORIGINS</div>
            <h2 className="sec-h2" style={{ fontSize: "clamp(36px,5vw,58px)" }}>
              WHO ARE WE<br /><span className="red">"YOU"</span>
            </h2>
            <p className="about-body">
              Founded in 2021 by Suyash "Yunay" Kandalgaonkar and operational since 2023, YOU esports is built on the belief that every gamer deserves a chance to shine.<br /><br />
              We bridge the gap between elite competition and community entertainment, fielding powerhouse esports rosters while supporting a diverse team of content creators.<br /><br />
              At our core, we are more than just an organization; we are a collective dedicated to helping players and fans grow together, ensuring that everyone has a path to involve themselves in the future of esports.
            </p>
          </div>
          <div className="quote-card card">
            <div className="quote-mark">"</div>
            <p className="quote-text">Every gamer deserves a chance to shine. We are more than an organization - we are a collective.</p>
            <div className="quote-attr">YOU ESPORTS</div>
          </div>
        </div>
      </section>

      <SectionDivider label="DIVISION" />
      {/* ROSTER */}
      <section id="roster" className="reveal">
        <div className="roster-header">
          <div>
            <div className="sec-label wipe">DIVISION</div>
            <h2 className="sec-h2">{activeGame}</h2>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginTop: "0.5rem" }}>
              {activeGame === "BGMI" ? "The undisputed kings of the sub-continent." : "Precision. Speed. Dominance on every map."}
            </p>
          </div>
          <div className="active-badge">{players.length} ACTIVE MEMBERS</div>
        </div>

        <div className="game-selector">
          {Object.keys(roster).map(game => (
            <button
              key={game}
              className={`game-tab ${activeGame === game ? "active" : ""}`}
              onClick={() => setActiveGame(game)}
            >{game}</button>
          ))}
        </div>

        <div className="roster-grid">
          {players.map(p => renderCard(p, activeGame, "VIEW PROFILE"))}
        </div>
      </section>

      <SectionDivider label="CREATORS" />
      {/* CONTENT CREATORS */}
      <section id="creators" className="reveal">
        <div className="roster-header">
          <div>
            <div className="sec-label wipe">CONTENT CREATORS</div>
            <h2 className="sec-h2">OUR <span className="red">CREATORS</span></h2>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginTop: "0.5rem" }}>
              The voices, faces & highlights of You eSports.
            </p>
          </div>
          <div className="active-badge">{creators.length} CREATORS</div>
        </div>

        <div className="roster-grid">
          {creators.map(c => renderCard(c, c.platform, "VIEW CHANNEL"))}
        </div>
      </section>

      <SectionDivider label="THE ARMORY - MERCH" />
      {/* SHOP */}
      <section id="shop" className="reveal">
        <div className="sec-label wipe">THE ARMORY</div>
        <h2 className="sec-h2">MERCH <span className="red">DROPS</span></h2>
        <div className="coming-soon-wrap card">
          <div className="cs-img-box">
            <img src={merchPreview} alt="You eSports Jersey First Look" />
          </div>
          <div className="cs-content">
            <div className="cs-icon">NEW</div>
            <div className="cs-title">COMING SOON</div>
            <p className="cs-sub">
              The armory is being forged. Exclusive You eSports jerseys, streetwear drops, and limited-edition gear are on their way. Stay locked in.
            </p>
            <div className="cs-badge">DROP DATE - TO BE ANNOUNCED</div>
          </div>
        </div>
      </section>

      <SectionDivider label="REACH OUT - CONNECT" />
      {/* CONTACT */}
      <section id="contact" className="reveal">
        <div className="sec-label wipe">REACH OUT</div>
        <div className="contact-inner card">
          <div>
            <h2 className="sec-h2" style={{ fontSize: "clamp(30px,4vw,48px)" }}>
              LET'S <span className="red">CONNECT</span>
            </h2>
            <p className="contact-sub">
              Whether you're looking for sponsorship opportunities, interested in joining our roster, or need support - we're here.
            </p>

            <div className="dept-grid">
              {depts.map((d, i) => (
                <button
                  key={i}
                  className={`dept-btn ${activeDept === i ? "active" : ""}`}
                  onClick={() => handleDeptClick(i)}
                >
                  <div className="dept-title">{d.title}</div>
                  <div className="dept-desc">{d.desc}</div>
                </button>
              ))}
            </div>

            <div className="info-list">
              {CONTACT_INFO_ITEMS.map((item) => (
                <div className="info-item" key={item.type}>
                  <div className="info-icon"><ContactInfoIcon type={item.type} /></div>
                  <div>
                    <div className="info-label">{item.label}</div>
                    <div className="info-val">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {socialLinks.length > 0 && (
              <>
                <div className="follow-label">FOLLOW US</div>
                <div className="socials">
                  {socialLinks.map(s => (
                    <a key={s.label} href={s.href} className="social-btn" target="_blank" rel="noopener noreferrer" aria-label={s.name}>
                      <SocialIcon name={s.name} />
                    </a>
                  ))}
                </div>
              </>
            )}

            <div className="resp-badge">
              <div className="resp-icon">OK</div>
              <div>
                <div className="rb-label">AVG. RESPONSE TIME</div>
                <div className="rb-val">Under 24 Hours</div>
              </div>
            </div>
          </div>

          <form className="form-grid" onSubmit={handleContactSubmit}>
            <div className="form-row">
              <input className="finput" type="text" placeholder="Your name" required value={formName} onChange={e => setFormName(e.target.value)} />
              <input className="finput" type="email" placeholder="you@example.com" required value={formEmail} onChange={e => setFormEmail(e.target.value)} />
            </div>
            <div className="form-row">
              <input className="finput" type="tel" placeholder="+91 00000 00000" value={formPhone} onChange={e => setFormPhone(e.target.value)} />
              <input className="finput" type="text" placeholder="Brief subject line" value={subject} onChange={e => setSubject(e.target.value)} />
            </div>
            <textarea className="finput" placeholder="Tell us about your inquiry in detail..." required value={formMessage} onChange={e => setFormMessage(e.target.value)} />
            <button className="send-btn" type="submit" disabled={formStatus === "sending"}>
              {formStatus === "sending" ? "SENDING..." : formStatus === "sent" ? "MESSAGE SENT!" : "SEND MESSAGE"}
            </button>
            {formStatus === "sent" && (
              <p className="form-note" style={{ color: "#00e676" }}>
                Your message has been sent successfully! We'll get back to you within 24 hours.
              </p>
            )}
            {formStatus === "error" && (
              <p className="form-note" style={{ color: "#ff5555" }}>
                Something went wrong. Please try again or email us directly at contact@youesports.org
              </p>
            )}
            {!formStatus && (
              <p className="form-note">
                By submitting this form, you agree that we may store and process your data to respond to your inquiry.
              </p>
            )}
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="reveal">
        <div>
          <h4>DIRECTORY</h4>
          <a href={getPageHref("home")}>Home</a>
          <a href={getPageHref("roster")}>Rosters</a>
          <a href={getPageHref("creators")}>Content Creators</a>
          <a href={getPageHref("shop")}>The Armory (Merch)</a>
          <a href={getPageHref("contact")}>Contact</a>
        </div>
        <div>
          <h4>HEADQUARTERS</h4>
          <div className="footer-hq">
            <strong>Mumbai, India</strong><br />
            Maharashtra 400001<br /><br />
            <a href="mailto:contact@youesports.org" style={{ display: "inline", color: RED }}>
              contact@youesports.org
            </a>
          </div>
        </div>
        <div>
          <h4>NETWORK</h4>
          <div className="footer-socials">
            {socialLinks.map(s => (
              <a key={s.label} href={s.href} className="footer-social" target="_blank" rel="noopener noreferrer" aria-label={s.name}>
                <SocialIcon name={s.name} />
              </a>
            ))}
          </div>
        </div>
      </footer>

      <div className="footer-bottom reveal">
        <span>Copyright 2025 <span className="accent">You eSports</span>. All rights reserved.</span>
        <span className="accent">THE PINNACLE OF ESPORTS</span>
        <button
          className="admin-open-btn"
          onClick={() => setAdminOpen(true)}
          title="Admin"
        >A</button>
      </div>
    </div>
  );
}
