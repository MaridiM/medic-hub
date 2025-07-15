export const AuthFooter = () => {
    return (
        <footer className='flex h-16 items-center justify-center px-4'>
            <div className='flex flex-col items-center px-2'>
                <span className='text-text text-p-xs tracking-wider'>Clinic Hub - Doctor Lab &copy; 2025</span>
                <span className='text-text-secondary text-label-md tracking-wider'>
                    {process.env.NEXT_PUBLIC_APP_NAME} v{process.env.NEXT_PUBLIC_APP_VERSION}
                </span>
            </div>
        </footer>
    )
}
