import { cn } from '@/utils/tailwindcss';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'RefreshIcon',
    emits: ['click'],
    props: {
        width: {
            type: String,
            default: '3.5'
        },
        height: {
            type: String,
            default: '3.5'
        },
        hoverClass: {
            type: String,
            default: 'hover:text-black hover:rotate-180 dark:hover:text-white'
        }
    },
    setup(props, { emit }) {
        const handleClick = () => {
            emit('click');
        }
        return () => (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class={cn(
                    `icon cursor-pointer`,
                    "transition-all duration-500",
                    "text-gray-400 dark:text-gray-600",
                    props.hoverClass
                )}
                onClick={handleClick}
                viewBox="0 0 1024 1024"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                width={props.width + 'rem'}
                height={props.height + 'rem'}
            >
                <path fill="currentColor" d="M733.04 379.104a264.112 264.112 0 0 0-468.112 41.76 14.336 14.336 0 0 1-17.968 8.16l-20.256-7.008a12.352 12.352 0 0 1-7.456-16.192 312.112 312.112 0 0 1 556.736-48.56l12.704-44.352a16 16 0 0 1 7.632-9.584l-24.752-13.712a14.464 14.464 0 0 1 20.912 16.64l-38.128 132.96a11.136 11.136 0 0 1-13.76 7.632l-132.96-38.128a14.464 14.464 0 0 1-3.04-26.56l24.752-13.712a16 16 0 0 1 12.16-1.392l42.032 12.048z m-447.52 280.352a264.112 264.112 0 0 0 468.112-41.76 14.336 14.336 0 0 1 17.968-8.16l20.256 7.008a12.352 12.352 0 0 1 7.44 16.176c-46.368 118.032-160.8 199.072-290.432 199.072-110.96 0-210.768-59.296-266.304-150.432l-12.704 44.288a16 16 0 0 1-7.616 9.584l-24.752 13.712a14.464 14.464 0 0 1-20.928-16.64l38.128-132.96a11.136 11.136 0 0 1 13.76-7.632l132.976 38.128a14.464 14.464 0 0 1 3.04 26.56l-24.768 13.712a16 16 0 0 1-12.16 1.392l-42.016-12.048z" ></path>
            </svg>
        );
    }
});
