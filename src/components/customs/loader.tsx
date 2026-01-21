import Image from "next/image";

export function Loader() {
    return (
        <div className="h-full w-full items-center justify-center flex flex-col">
            <Image
                src="/logos/appload.svg"
                alt="loading-logo"
                width={1}
                height={1}
                priority
                className="size-48 animate-pulse"
            />
        </div>
    )
}
