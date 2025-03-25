import '../global.css';

import { Slot, useSegments, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { useAuth } from '../store/useAuth'

export default function RootLayout() {
    const { isAuthenticated } = useAuth()
    const segments = useSegments()
    const router = useRouter()

    useEffect(() => {
        const inAuthGroup = segments[0] === '(auth)'

        if (!isAuthenticated && !inAuthGroup) {
            router.replace('/login')
        }

        if (isAuthenticated && inAuthGroup) {
            router.replace('/')
        }
    }, [isAuthenticated, segments])

    return <Slot />
}
