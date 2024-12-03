import { cn } from '@/utils/tailwindcss';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'DarkIcon',
    props: {
        width: {
            type: String,
            default: '2'
        },
        height: {
            type: String,
            default: '2'
        },
        hoverClass: {
            type: String,
            default: 'hover:text-blue-500 dark:hover:text-blue-500 hover:scale-110'
        }
    },
    setup(props) {
        return () => (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class={cn(
                    `icon cursor-pointer`,
                    "transition-all duration-300",
                    "text-black dark:text-white",
                    props.hoverClass
                )}
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 1024 1024"
                width={props.width + 'rem'}
                height={props.height + 'rem'}
            >
                <path fill="currentColor"
                    d="M720.024199 351.521545c0 259.827641-221.37703 469.494584-494.203586 473.067991 78.511375 91.05714 197.258887 145.666943 326.238161 145.666942 231.677057 0 418.199246-174.779145 418.199246-388.489122 0-162.588837-109.02069-306.67623-270.391319-363.244579 13.309646 42.857343 20.157499 87.526106 20.157498 132.998768zM643.743261 219.995218c-9.553802-27.055963-9.007669-37.450152 0-49.873508 0 0 28.781462-16.84892 59.647412-7.071485C889.786921 222.09383 1024.000365 387.289747 1024.000365 581.767356 1024.000365 825.967816 812.66442 1024 552.058774 1024c-157.887853 0-297.577931-72.693407-383.223172-184.328239-6.153416-8.018979-9.259549-17.87292-8.788745-27.878694 1.121692-23.846253 21.852395-42.292377 46.303632-41.197757 4.425563 0.198915 8.55452 0.297784 12.385692 0.297784 247.139457 0 447.544497-187.78983 447.544497-419.371549 0-45.950529-7.93188-90.163789-22.53624-131.52515zM337.560199 498.624441l4.35612-26.753471-18.702713-19.486602c-4.374952-4.557389-4.269021-11.840736 0.235403-16.266299a11.31932 11.31932 0 0 1 6.2464-3.126143l25.329287-3.813517 20.8896-44.885333a0.75211 0.75211 0 0 0 0.051788-0.154189l0.015302-0.068266a0.045903 0.045903 0 0 1 0.01177-0.022364 0.009416 0.009416 0 0 1 0.015301 0.003532l20.934326 45.12662 25.361067 3.818225c6.209913 0.935724 10.495411 6.787825 9.571457 13.07189a11.555899 11.555899 0 0 1-3.080239 6.311136l-18.665048 19.49131 4.354943 26.753471c1.021646 6.268763-3.173223 12.187954-9.369012 13.220193a11.254584 11.254584 0 0 1-7.33749-1.277057l-21.754703-12.137343-21.75588 12.137343c-5.497821 3.068469-12.412763 1.045186-15.444745-4.518547a11.620634 11.620634 0 0 1-1.262934-7.424589zM32.549441 178.15246l8.990014-53.652892L3.423114 85.910069a11.767761 11.767761 0 0 1 0.251881-16.84068 12.192662 12.192662 0 0 1 6.654823-3.236782l52.159264-7.630566C74.850057 19.40068 86.55779 0 97.609928 0c11.054492 0 21.675844 19.40068 31.866409 58.202041l52.191044 7.636451c6.617159 0.96868 11.182786 7.026759 10.198805 13.532101a11.833674 11.833674 0 0 1-3.281508 6.534768l-38.03395 38.594207 8.990014 53.652892c1.086382 6.490041-3.382731 12.617563-9.983412 13.687466-2.683586 0.434317-5.436616-0.031779-7.81771-1.32296l-45.695117-24.773738-45.695117 24.773738c-5.857986 3.176754-13.226078 1.082851-16.455798-4.677444a11.737159 11.737159 0 0 1-1.345324-7.685885z" ></path>
            </svg>
        );
    }
});
