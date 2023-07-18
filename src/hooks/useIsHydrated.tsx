import { useEffect, useState } from "react";

/**
 * @description
 * Text content does not match server-rendered HTML
 * Why This Error Occurred
 * While rendering your application, there was a difference between the React tree that was pre-rendered from the server and the React tree that was rendered during the first render in the browser (hydration).
 * How to Fix React Hydration Error in NextJS!
 * https://nextjs.org/docs/messages/react-hydration-error - official docks
 * https://blog.idrisolubisi.com/how-to-fix-react-hydration-error-in-nextjs-practical-guide#heading-understanding-react-hydration
 */
export default function useIsHydrated() {
    const [ isSsrHydrated, setIsSsrHydrated ] = useState( false );
    const checkEthereumAvailable = () => {
        setIsSsrHydrated(
            Boolean( !isSsrHydrated && typeof window !== 'undefined' )
        );
    }

    useEffect( () => { checkEthereumAvailable() }, [] )

    return { isSsrHydrated }
}
