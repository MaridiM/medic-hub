# File: modules\organization\pages\create-organization.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/modules/organization/pages/create-organization.tsx`

## Category
Frontend

## File Type
TSX (create-organization.tsx)

## Size
58495 characters, 913 lines

## Full Code

```typescript
'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
    ChevronDown,
    ChevronUp,
    HelpCircle,
    Hospital,
    Info,
    Layers,
    Plus,
    Settings,
    Sparkles,
    User,
    X
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { mockUser } from '@/packages/api/mocks'
import { ToothIcon } from '@/packages/assets/icons'
import {
    Badge,
    Button,
    Card,
    CardContent,
    CardHeader,
    Header,
    Hint,
    Input,
    Label,
    MultiSelect,
    Option,
    PresetOrCustomInput,
    SingleSelect,
    Textarea,
    Tooltip
} from '@/packages/components'
import { PATHS } from '@/packages/config'
import { getCurrentLanguage, languages } from '@/packages/libs/i18n'
import { cn } from '@/packages/utils'

import { OrgTypeIcon, SpecialistTypeIcon } from '../shared/assets'
import { useResolvedSettings } from '../shared/hooks'

type TMode = 'specialist' | 'clinic' | 'dentistry' | 'cosmetology' | 'other'

const specializationOptions: Option[] = [
    { value: 'dentist', label: 'Dentist' },
    { value: 'cosmetologist', label: 'Cosmetologist' },
    { value: 'dermatologist', label: 'Dermatologist' },
    { value: 'therapist', label: 'Therapist' },
    { value: 'surgeon', label: 'Surgeon' },
    { value: 'cardiologist', label: 'Cardiologist' }
]

const languageOptions: Option[] = [
    { value: 'auto', label: 'Auto (by browser)' },
    ...languages.map(lng => ({
        value: lng,
        label: lng.toUpperCase()
    }))
]

const timezoneOptions: Option[] = [
    { value: 'auto', label: 'Auto (detect by browser)' },
    { value: 'Europe/Kyiv', label: 'Europe/Kyiv (UTC+2/+3)' },
    { value: 'Europe/London', label: 'Europe/London (UTC+0/+1)' },
    { value: 'Europe/Berlin', label: 'Europe/Berlin (UTC+1/+2)' },
    { value: 'Europe/Moscow', label: 'Europe/Moscow (UTC+3)' },
    { value: 'America/New_York', label: 'America/New York (UTC-5/-4)' },
    { value: 'America/Los_Angeles', label: 'America/Los Angeles (UTC-8/-7)' },
    { value: 'Asia/Dubai', label: 'Asia/Dubai (UTC+4)' },
    { value: 'Asia/Tokyo', label: 'Asia/Tokyo (UTC+9)' }
]

const weekdayOptions: Option[] = [
    { value: 'auto', label: 'Auto (by locale)' },
    { value: 'monday', label: 'Monday' },
    { value: 'sunday', label: 'Sunday' },
    { value: 'saturday', label: 'Saturday' }
]

const businessHoursOptions: Option[] = [
    { value: 'auto', label: 'Auto (by region)' },
    { value: '09:00-18:00', label: '09:00 - 18:00' },
    { value: '08:00-17:00', label: '08:00 - 17:00' },
    { value: '10:00-19:00', label: '10:00 - 19:00' },
    { value: '08:00-20:00', label: '08:00 - 20:00' },
    { value: '09:00-21:00', label: '09:00 - 21:00' },
    { value: '24/7', label: '24/7' }
]

const currencyOptions: Option[] = [
    { value: 'auto', label: 'Auto (by locale)' },
    { value: 'usd', label: 'USD ($)' },
    { value: 'eur', label: 'EUR (€)' },
    { value: 'gbp', label: 'GBP (£)' },
    { value: 'uah', label: 'UAH (₴)' },
    { value: 'pln', label: 'PLN (zł)' },
    { value: 'rub', label: 'RUB (₽)' },
    { value: 'byn', label: 'BYN (Br)' },
    { value: 'czk', label: 'CZK (Kč)' },
    { value: 'jpy', label: 'JPY (¥)' },
    { value: 'cny', label: 'CNY (¥)' },
    { value: 'inr', label: 'INR (₹)' },
    { value: 'aed', label: 'AED (د.إ)' },
    { value: 'cad', label: 'CAD ($)' },
    { value: 'aud', label: 'AUD ($)' },
    { value: 'chf', label: 'CHF (Fr)' },
    { value: 'sek', label: 'SEK (kr)' },
    { value: 'nok', label: 'NOK (kr)' },
    { value: 'dkk', label: 'DKK (kr)' }
]

const workExperienceOptions: Option[] = [
    { value: '0-1', label: 'Less than 1 year' },
    { value: '1-3', label: '1-3 years' },
    { value: '3-5', label: '3-5 years' },
    { value: '5-7', label: '5-7 years' },
    { value: '7-10', label: '7-10 years' },
    { value: '10+', label: '10+ years' }
]

interface IModes {
    mode: TMode
    title: string
    description: string
    icon: any
    color: string
    colorIcon: string
}

const modes: IModes[] = [
    {
        mode: 'specialist',
        title: 'Specialist',
        description: 'Designed for solo doctors, dentists, or cosmetologists who manage all visits without staff.',
        icon: User,
        color: '#E0F2FE',
        colorIcon: '#0369A1'
    },
    {
        mode: 'clinic',
        title: 'Clinic',
        description: 'Ideal for multidisciplinary medical centers with multiple specialists and departments.',
        icon: Hospital,
        color: '#ECFDF5',
        colorIcon: '#047857'
    },
    {
        mode: 'dentistry',
        title: 'Dentistry',
        description: 'Perfect for dental offices and clinics offering individual or team-based practice.',
        icon: ToothIcon,
        color: '#FAE8FF',
        colorIcon: '#86198F'
    },
    {
        mode: 'cosmetology',
        title: 'Cosmetology',
        description: 'Designed for cosmetology and aesthetic medicine centers focused on beauty and care.',
        icon: Sparkles,
        color: '#FFF1F2',
        colorIcon: '#BE123C'
    },
    {
        mode: 'other',
        title: 'Other',
        description: 'For SPA, massage studios, and other wellness practices focused on health and recovery.',
        icon: Layers,
        color: '#EEF2FF',
        colorIcon: '#4338CA'
    }
]

interface IWorkingDays {
    day: string
    hours: string | null
}

const workingDays: IWorkingDays[] = [
    { day: 'Monday', hours: '09:00–18:00' },
    { day: 'Tuesday', hours: '09:00–18:00' },
    { day: 'Wednesday', hours: '09:00–18:00' },
    { day: 'Thursday', hours: '09:00–18:00' },
    { day: 'Friday', hours: '09:00–18:00' },
    { day: 'Saturday', hours: null },
    { day: 'Sunday', hours: null }
]

const MAX_DESCRIPTION_LENGTH = 1000
const MIN_DESCRIPTION_LENGTH = 50

export const CreateOrganization = () => {
    const router = useRouter()

    // States
    const [mode, setMode] = useState<TMode>('specialist')
    const [specializations, setSpecializations] = useState<string[]>([])

    const [language, setLanguage] = useState<string>('auto')
    const [timezone, setTimezone] = useState<string>('auto')
    const [currency, setCurrency] = useState<string>('auto')
    const [firstDayOfWeek, setFirstDayOfWeek] = useState<string>('auto')
    const [businessHours, setBusinessHours] = useState<string>('09:00-18:00')

    // form field
    const [description, setDescription] = useState('')

    const resolved = useResolvedSettings({
        language,
        timezone,
        currency,
        firstDayOfWeek,
        businessHours
    })

    const handleCreateOrganization = async () => {
        // Logic here
        router.push(PATHS.dashboard())
    }

    // Work Experience states
    const [workExperienceMode, setWorkExperienceMode] = useState<'preset' | 'custom'>('preset')
    const [workExperience, setWorkExperience] = useState<string>('')

    // Toggle state for Advanced section
    const [showAdvanced, setShowAdvanced] = useState(false)

    const descriptionProgress = (description.length / MAX_DESCRIPTION_LENGTH) * 100

    useEffect(() => {
        const fetchLanguage = async () => {
            const lng = await getCurrentLanguage()
            setLanguage(lng)
        }
        fetchLanguage()
    }, [])

    const toggleExperienceMode = () => {
        setWorkExperienceMode(prev => (prev === 'preset' ? 'custom' : 'preset'))
        setWorkExperience('')
    }

    const setTitle = (): string => {
        const title = modes.find(item => item.mode === mode)
        return title?.title ?? 'Organization'
    }

    const title = setTitle()

    return (
        <div className='bg-background flex min-h-0 w-full flex-1 flex-col overflow-hidden'>
            <Header user={mockUser} />

            <div className='flex min-h-0 flex-1 flex-col overflow-y-auto p-2 md:p-4'>
                <div className='mx-auto flex w-full max-w-[1520px] flex-col gap-4'>
                    {/* Page Header */}
                    <header className='flex w-full flex-col gap-4 px-1 sm:flex-row sm:items-start'>
                        <div className='hidden self-start pt-[3px] md:block'>
                            {mode === 'specialist' ? (
                                <SpecialistTypeIcon className='h-12 w-12 md:h-[80px] md:w-[46px] md:min-w-[46px]' />
                            ) : (
                                <OrgTypeIcon className='h-12 w-12 md:h-[80px] md:w-[46px] md:min-w-[46px]' />
                            )}
                        </div>

                        {/* HEADER CONTENT WRAPPER */}
                        <div className='flex w-full flex-col justify-between gap-4 sm:flex-row sm:items-start'>
                            {/* LEFT SECTION: Title + Description */}
                            <div className='flex flex-col gap-1'>
                                <h1 className='text-text text-h4 sm:text-h3 min-w-fit text-center font-medium md:text-left'>
                                    {title} Setup
                                </h1>
                                <p className='text-text-secondary text-p md:text-text- max-w-3xl text-center text-sm md:text-left'>
                                    {mode === 'specialist'
                                        ? 'Ideal for private practitioners — doctors, dentists, or cosmetologists — who manage appointments independently without administrative staff. All tools for working with patients in one place.'
                                        : 'For clinics or medical centers with multiple offices and specialist teams. Centralized management of schedules, staff, and finances.'}
                                </p>
                            </div>

                            {/* RIGHT SECTION (Desktop only): Buttons */}
                            <div className='hidden w-full shrink-0 gap-2 sm:mt-1 sm:w-auto sm:gap-4 lg:flex'>
                                <Button
                                    variant='outline'
                                    onClick={() => router.push(PATHS.dashboard())}
                                    className='flex-1 sm:flex-none'
                                >
                                    Back
                                </Button>
                                <Button
                                    variant='primary'
                                    className='w-auto min-w-[40px] flex-1 sm:w-fit sm:flex-none'
                                    onClick={handleCreateOrganization}
                                >
                                    <Plus className='stroke-text-foreground !size-5 sm:!size-4' />
                                    <span className='ml-2 text-current'>Create</span>
                                    <span className='hidden text-current md:inline'>&nbsp;{title}</span>
                                </Button>
                            </div>
                        </div>
                    </header>

                    {/* Main Content Grid */}
                    <div className='flex flex-col gap-4 px-1 pb-4 lg:flex-row'>
                        {/* Left Column: Mode Selection */}
                        <div className='flex w-full flex-shrink-0 flex-col gap-2 lg:w-80'>
                            <div className='xs:grid-cols-2 grid w-full grid-cols-1 gap-2 lg:grid-cols-1'>
                                {modes.map((item, idx) => {
                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => setMode(item.mode)}
                                            className={cn(
                                                'bg-card border-border/20 hover:border-border/40 w-full cursor-pointer rounded-xl border p-3 shadow-sm transition-all duration-500 select-none',
                                                {
                                                    'ring-primary hover:border-border/20 shadow-lg ring-2':
                                                        mode === item.mode
                                                }
                                            )}
                                        >
                                            <div className='flex items-center justify-between gap-2'>
                                                <div className='flex items-center gap-2'>
                                                    <span
                                                        className='flex h-7 w-7 min-w-[28px] items-center justify-center rounded-md'
                                                        style={{
                                                            backgroundColor: item.color
                                                        }}
                                                    >
                                                        <item.icon className={cn('h-4 w-4')} stroke={item.colorIcon} />
                                                    </span>
                                                    <h3 className='text-h5 text-text font-medium'>{item.title}</h3>
                                                </div>

                                                <AnimatePresence mode='wait'>
                                                    {mode === item.mode && (
                                                        <motion.div
                                                            initial={{ scale: 0, opacity: 0 }}
                                                            animate={{ scale: 1, opacity: 1 }}
                                                            exit={{ scale: 0, opacity: 0 }}
                                                            transition={{
                                                                type: 'spring',
                                                                stiffness: 500,
                                                                damping: 30
                                                            }}
                                                            className='bg-primary flex items-center justify-center rounded-full px-2 py-0.5'
                                                        >
                                                            <Badge className='text-p-xs text-text-foreground h-auto bg-transparent p-0 font-light tracking-wider'>
                                                                Selected
                                                            </Badge>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            <p className='text-p-xs text-text-secondary mt-3 leading-relaxed'>
                                                {item.description}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                            <p className='text-p-xs text-text-tertiary mt-3 text-center lg:text-left'>
                                You can change this at any time in organization settings
                            </p>
                        </div>

                        {/* Middle & Right Columns Wrapper */}
                        <div className='flex min-w-0 flex-1 flex-col gap-4 xl:flex-row'>
                            {/* Middle Column: Basic Info */}
                            <Card className='h-fit w-full flex-1 gap-2 py-4 xl:max-w-3xl'>
                                <CardHeader className='border-border/10 flex flex-col gap-0 border-b !pb-4'>
                                    <div className='flex flex-wrap items-center gap-2 sm:gap-4'>
                                        <h3 className='text-text text-h4 font-medium'>Basic Information</h3>
                                        <div className='xs:flex hidden items-center gap-2'>
                                            <Info className='stroke-text-tertiary h-4 w-4' />
                                            <span className='text-text-tertiary text-p-xs sm:text-p-sm'>
                                                Can be changed later
                                            </span>
                                        </div>
                                    </div>
                                    <span className='text-text-secondary text-p-xs mt-1'>
                                        This data will appear in the patient profile, contracts, invoices, and
                                        reminders.
                                    </span>
                                </CardHeader>
                                <CardContent className='flex flex-col gap-4 px-4'>
                                    {/* Basic Information */}
                                    <div className='flex w-full flex-col gap-3'>
                                        <header className='flex w-full'>
                                            <span className='text-text text-p-md w-full font-medium'>
                                                Basic Information
                                            </span>
                                        </header>

                                        <div className='grid w-full grid-cols-1 gap-4 md:grid-cols-2'>
                                            <div className='flex w-full min-w-0 flex-col gap-1'>
                                                <Label className='!text-text-secondary text-p-sm'>
                                                    Clinic Name <span className='text-negative'>*</span>
                                                </Label>
                                                <Input placeholder='Aesthetic Clinic' className='w-full' />
                                            </div>
                                            <div className='flex w-full min-w-0 flex-col gap-1'>
                                                <Label className='!text-text-secondary text-p-sm'>
                                                    Profile / Specialization <span className='text-negative'>*</span>
                                                </Label>
                                                <MultiSelect
                                                    options={specializationOptions}
                                                    value={specializations}
                                                    onChange={setSpecializations}
                                                    placeholder='Select specialization...'
                                                    searchPlaceholder='Search...'
                                                    emptyText='Not found'
                                                    searchable
                                                    className='w-full'
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contacts */}
                                    <div className='flex w-full flex-col gap-3'>
                                        <header className='flex w-full'>
                                            <span className='text-text text-p-md w-full font-medium'>Contacts</span>
                                        </header>

                                        <div className='grid w-full grid-cols-1 gap-4 md:grid-cols-2'>
                                            <div className='flex w-full min-w-0 flex-col gap-1'>
                                                <Label className='!text-text-secondary text-p-sm'>
                                                    E-mail (for invoices) <span className='text-negative'>*</span>
                                                </Label>
                                                <Input placeholder='clinic@example.com' className='w-full' />
                                            </div>
                                            <div className='flex w-full min-w-0 flex-col gap-1'>
                                                <Label className='!text-text-secondary text-p-sm'>
                                                    Booking Phone (E.164) <span className='text-negative'>*</span>
                                                </Label>
                                                <Input placeholder='+123XXXXXXXXX' className='w-full' />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className='flex w-full flex-col gap-3'>
                                        <header className='flex w-full'>
                                            <span className='text-text text-p-md w-full font-medium'>Address</span>
                                        </header>

                                        <div className='grid w-full grid-cols-1 gap-4 md:grid-cols-2'>
                                            <div className='flex w-full min-w-0 flex-col gap-1'>
                                                <Label className='!text-text-secondary text-p-sm'>
                                                    City / Location <span className='text-negative'>*</span>
                                                </Label>
                                                <Input placeholder='Kyiv, Troieshchyna' className='w-full' />
                                            </div>
                                            <div className='flex w-full min-w-0 flex-col gap-1'>
                                                <Label className='!text-text-secondary text-p-sm'>
                                                    Office / Clinic Address <span className='text-negative'>*</span>
                                                </Label>
                                                <Input placeholder='10 Shevchenko St.' className='w-full' />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Regional & Time Settings */}
                                    <div className='flex w-full flex-col gap-3'>
                                        <header className='flex w-full'>
                                            <span className='text-text text-p-md w-full font-medium'>
                                                Regional & Time Settings
                                            </span>
                                        </header>

                                        <div className='flex w-full flex-col gap-4'>
                                            <div className='grid w-full grid-cols-1 gap-4 md:grid-cols-2'>
                                                <div className='flex w-full min-w-0 flex-col gap-1'>
                                                    <Label className='!text-text-secondary text-p-sm'>
                                                        Language / Locale
                                                    </Label>
                                                    <SingleSelect
                                                        options={languageOptions}
                                                        value={language}
                                                        onChange={setLanguage}
                                                        placeholder='Select language...'
                                                        searchPlaceholder='Search...'
                                                        emptyText='Not found'
                                                        className='w-full'
                                                    />
                                                </div>
                                                <div className='flex w-full min-w-0 flex-col gap-1'>
                                                    <Label className='!text-text-secondary text-p-sm'>Time zone</Label>
                                                    <SingleSelect
                                                        options={timezoneOptions}
                                                        value={timezone}
                                                        onChange={setTimezone}
                                                        placeholder='Select timezone...'
                                                        searchPlaceholder='Search...'
                                                        emptyText='Not found'
                                                        searchable
                                                        className='w-full'
                                                    />
                                                </div>
                                            </div>

                                            <div className='grid w-full grid-cols-1 gap-4 md:grid-cols-2'>
                                                <div className='flex w-full min-w-0 flex-col gap-1'>
                                                    <Label className='!text-text-secondary text-p-sm'>
                                                        First day of week
                                                    </Label>
                                                    <SingleSelect
                                                        options={weekdayOptions}
                                                        value={firstDayOfWeek}
                                                        onChange={setFirstDayOfWeek}
                                                        placeholder='Select day...'
                                                        searchPlaceholder='Search...'
                                                        emptyText='Not found'
                                                        className='w-full'
                                                    />
                                                </div>
                                                <div className='flex w-full min-w-0 flex-col gap-1'>
                                                    <Label className='!text-text-secondary text-p-sm'>
                                                        Default business hours
                                                    </Label>
                                                    <SingleSelect
                                                        options={businessHoursOptions}
                                                        value={businessHours}
                                                        onChange={setBusinessHours}
                                                        placeholder='Select hours...'
                                                        searchPlaceholder='Search...'
                                                        emptyText='Not found'
                                                        className='w-full'
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional */}
                                    <div className='flex w-full flex-col gap-3'>
                                        <header className='flex w-full items-center justify-between'>
                                            <span className='text-text text-p-md font-medium'>Additional</span>
                                            <Button
                                                className='text-text-secondary group h-auto min-w-fit cursor-pointer items-center gap-2 p-0 hover:bg-transparent'
                                                onClick={() => setShowAdvanced(!showAdvanced)}
                                            >
                                                {showAdvanced ? (
                                                    <ChevronUp className='stroke-text-secondary group-hover:stroke-text !size-4 transition-colors' />
                                                ) : (
                                                    <ChevronDown className='stroke-text-secondary group-hover:stroke-text !size-4 transition-colors' />
                                                )}
                                                <span className='group-hover:text-text text-sm text-current transition-colors'>
                                                    {showAdvanced ? 'Hide advanced' : 'Show advanced'}
                                                </span>
                                            </Button>
                                        </header>

                                        {/* Additional Fields - Collapsible */}
                                        <AnimatePresence initial={false}>
                                            {showAdvanced && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                    className='overflow-hidden'
                                                >
                                                    <div className='flex w-full flex-col gap-4 pt-2'>
                                                        <div className='grid w-full grid-cols-1 gap-4 md:grid-cols-2'>
                                                            <div className='flex w-full min-w-0 flex-col gap-1'>
                                                                <Label className='!text-text-secondary text-p-sm'>
                                                                    Registration Data{' '}
                                                                    <span className='text-primary text-p-xs'>
                                                                        (opt)
                                                                    </span>
                                                                </Label>
                                                                <Input
                                                                    placeholder='License number'
                                                                    className='w-full'
                                                                />
                                                            </div>
                                                            <div className='flex w-full min-w-0 flex-col gap-1'>
                                                                <Label className='!text-text-secondary text-p-sm'>
                                                                    Currency{' '}
                                                                    <span className='text-primary text-p-xs'>
                                                                        (opt)
                                                                    </span>
                                                                </Label>
                                                                <SingleSelect
                                                                    options={currencyOptions}
                                                                    value={currency}
                                                                    onChange={setCurrency}
                                                                    placeholder='Select currency...'
                                                                    searchPlaceholder='Search...'
                                                                    emptyText='Not found'
                                                                    searchable
                                                                    className='w-full'
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Work Experience */}
                                                        <div className='grid w-full grid-cols-1 gap-4 md:grid-cols-2'>
                                                            <div className='flex w-full min-w-0 flex-col gap-1'>
                                                                <div className='flex items-center justify-between'>
                                                                    <Label className='!text-text-secondary text-p-sm'>
                                                                        Work Experience{' '}
                                                                        <span className='text-primary text-p-xs'>
                                                                            (opt)
                                                                        </span>
                                                                    </Label>
                                                                    <button
                                                                        type='button'
                                                                        onClick={toggleExperienceMode}
                                                                        className='text-primary hover:text-primary/80 text-p-xs ml-2 whitespace-nowrap transition-colors hover:underline'
                                                                    >
                                                                        {workExperienceMode === 'preset'
                                                                            ? 'Enter custom'
                                                                            : 'Choose range'}
                                                                    </button>
                                                                </div>

                                                                <PresetOrCustomInput
                                                                    mode={workExperienceMode}
                                                                    value={workExperience}
                                                                    onChange={setWorkExperience}
                                                                    options={workExperienceOptions}
                                                                    selectPlaceholder='Select range...'
                                                                    selectEmptyText='No range'
                                                                    inputPlaceholder='Years'
                                                                    inputType='number'
                                                                    min={0}
                                                                    max={50}
                                                                />

                                                                {workExperience && (
                                                                    <span className='text-text-tertiary text-p-xs mt-1'>
                                                                        {workExperienceMode === 'preset'
                                                                            ? `Selected: ${workExperienceOptions.find(opt => opt.value === workExperience)?.label}`
                                                                            : `${workExperience} year${Number(workExperience) !== 1 ? 's' : ''} of experience`}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {/* Spacer */}
                                                            <div className='hidden md:block' />
                                                        </div>

                                                        <div className='flex w-full flex-col gap-1'>
                                                            <Label className='!text-text-secondary text-p-sm'>
                                                                Description / Specialization{' '}
                                                                <span className='text-primary text-p-xs'>(opt)</span>
                                                            </Label>
                                                            <div className='relative'>
                                                                <Textarea
                                                                    value={description}
                                                                    onChange={e => setDescription(e.target.value)}
                                                                    placeholder='Aesthetic dentistry, implantation, surgery. Operating since 2015.'
                                                                    className={cn(
                                                                        'text-p-sm min-h-[80px] w-full resize-none overflow-y-auto leading-5',
                                                                        description.length > 0 &&
                                                                            description.length <
                                                                                MIN_DESCRIPTION_LENGTH &&
                                                                            'border-warning',
                                                                        description.length >= MAX_DESCRIPTION_LENGTH &&
                                                                            'border-negative'
                                                                    )}
                                                                    maxLength={MAX_DESCRIPTION_LENGTH}
                                                                    rows={4}
                                                                />
                                                            </div>
                                                            <div className='flex flex-wrap items-center justify-between gap-2'>
                                                                <span className='text-text-tertiary text-p-xs'>
                                                                    {description.length === 0
                                                                        ? 'Min. 50 chars'
                                                                        : description.length < MIN_DESCRIPTION_LENGTH
                                                                          ? `${MIN_DESCRIPTION_LENGTH - description.length} more`
                                                                          : 'Good ✓'}
                                                                </span>
                                                                <span
                                                                    className={cn(
                                                                        'text-p-xs font-medium',
                                                                        descriptionProgress < 50
                                                                            ? 'text-text-tertiary'
                                                                            : descriptionProgress < 90
                                                                              ? 'text-positive'
                                                                              : descriptionProgress < 100
                                                                                ? 'text-warning'
                                                                                : 'text-negative'
                                                                    )}
                                                                >
                                                                    {description.length} / {MAX_DESCRIPTION_LENGTH}
                                                                </span>
                                                            </div>
                                                            <div className='bg-border/20 h-1 w-full overflow-hidden rounded-full'>
                                                                <div
                                                                    className={cn(
                                                                        'h-full transition-all duration-300',
                                                                        descriptionProgress < 90
                                                                            ? 'bg-positive'
                                                                            : 'bg-warning'
                                                                    )}
                                                                    style={{ width: `${descriptionProgress}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Right Column: Settings */}
                            <Card className='h-fit w-full flex-shrink-0 gap-2 py-4 xl:w-[400px]'>
                                <CardHeader className='border-border/10 flex flex-col gap-0 border-b !pb-4'>
                                    <div className='flex flex-wrap items-center gap-2 sm:gap-4'>
                                        <h3 className='text-text text-h4 font-medium'>Specialist Settings</h3>
                                        <div className='xs:flex hidden items-center gap-2'>
                                            <Info className='stroke-text-tertiary h-4 w-4' />
                                            <span className='text-text-tertiary sm:text-p-sm text-p-xs pt-0.5'>
                                                Change later
                                            </span>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className='grid grid-cols-1 gap-4 px-4 md:grid-cols-2 xl:grid-cols-1'>
                                    {/* Working Days Section */}
                                    <div className='flex w-full flex-col gap-3'>
                                        <header className='flex w-full items-center justify-between'>
                                            <span className='text-text text-p-md font-medium'>
                                                Working Days <span className='text-primary text-p-xs'>(default)</span>
                                            </span>

                                            <Button
                                                variant='outline'
                                                icon='sm'
                                                onClick={() => console.log('WORKING DAY: SETTINGS')}
                                                className='size-8 min-w-8'
                                            >
                                                <Settings className='stroke-1.5 stroke-text !size-4 min-w-4 stroke-[1.5]' />
                                            </Button>
                                        </header>

                                        <div className='grid w-full grid-cols-2 gap-2 pb-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2'>
                                            {workingDays.map((workDay, index) => (
                                                <Button
                                                    key={index}
                                                    className={cn(
                                                        'border-border/20 flex items-center gap-2 overflow-hidden rounded-md border p-2',
                                                        workDay.hours ? '' : 'opacity-25'
                                                    )}
                                                    onClick={() => console.log(`WORKING DAY: ${workDay.day}`)}
                                                >
                                                    <span className='text-text text-p-sm w-full truncate text-left'>
                                                        {workDay.day}
                                                    </span>
                                                    {workDay.hours ? (
                                                        <span className='text-text-secondary text-p-sm min-w-fit text-xs'>
                                                            {workDay.hours}
                                                        </span>
                                                    ) : (
                                                        <span className='flex size-5 min-w-fit items-center justify-center px-1'>
                                                            <span className='bg-text text-p-sm min-h-px w-2.5 min-w-fit' />
                                                        </span>
                                                    )}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Notification Channels Section */}
                                    <div className='flex w-full flex-col gap-3'>
                                        <header className='flex w-full items-center justify-between'>
                                            <span className='text-text text-p-md font-medium'>
                                                Notification Channels
                                            </span>

                                            <Button
                                                variant='outline'
                                                icon='sm'
                                                onClick={() => console.log('NOTIFICATION: SETTINGS')}
                                                className='size-8 min-w-8'
                                            >
                                                <Settings className='stroke-1.5 stroke-text !size-4 min-w-4 stroke-[1.5]' />
                                            </Button>
                                        </header>

                                        <div className='flex flex-col gap-4'>
                                            <div className='flex w-full flex-wrap gap-2'>
                                                <div className='bg-background border-border/10 flex items-center gap-1 rounded-sm border px-3 py-1'>
                                                    <span className='text-text text-label-md min-w-fit'>SMS</span>
                                                </div>
                                                <div className='bg-background border-border/10 flex h-6 items-center gap-1 rounded-sm border px-3'>
                                                    <span className='text-text text-label-md min-w-fit'>E-mail</span>
                                                </div>
                                                <div className='bg-background border-border/10 flex h-6 items-center gap-1 rounded-sm border px-3'>
                                                    <span className='text-text text-label-md min-w-fit'>Telegram</span>
                                                </div>
                                                <div className='bg-background border-border/10 flex h-6 items-center gap-1 rounded-sm border px-3'>
                                                    <span className='text-text text-label-md min-w-fit'>Viber</span>
                                                </div>
                                                <div className='bg-background border-border/10 flex h-6 items-center gap-1 rounded-sm border px-3'>
                                                    <span className='text-text text-label-md min-w-fit'>WhatsApp</span>
                                                </div>
                                            </div>

                                            <div className='grid w-full grid-cols-2 gap-4 pb-4'>
                                                <div className='flex flex-col gap-2'>
                                                    <div className='flex w-full items-center gap-2'>
                                                        <span className='!text-text-secondary text-p-sm min-w-fit'>
                                                            Days Before
                                                        </span>
                                                        <Hint tooltip='Select how many days before the visit to send reminders.'>
                                                            <HelpCircle className='stroke-text-secondary hover:stroke-text transiton h-4 min-w-4 duration-300 ease-in-out' />
                                                        </Hint>
                                                    </div>
                                                    <div className='flex gap-1'>
                                                        <span className='bg-background border-border/10 flex size-6 min-h-6 min-w-6 items-center justify-center rounded-sm border text-sm'>
                                                            7
                                                        </span>
                                                        <span className='bg-background border-border/10 flex size-6 min-h-6 min-w-6 items-center justify-center rounded-sm border text-sm'>
                                                            3
                                                        </span>
                                                        <span className='bg-background border-border/10 flex size-6 min-h-6 min-w-6 items-center justify-center rounded-sm border text-sm'>
                                                            1
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='flex flex-col gap-2'>
                                                    <div className='flex w-full items-center gap-2'>
                                                        <span className='!text-text-secondary text-p-sm min-w-fit'>
                                                            Hours Before
                                                        </span>
                                                        <Hint tooltip='Select how many hours before the visit to send reminders.'>
                                                            <HelpCircle className='stroke-text-secondary hover:stroke-text transiton h-4 min-w-4 duration-300 ease-in-out' />
                                                        </Hint>
                                                    </div>
                                                    <div className='flex gap-1'>
                                                        <span className='bg-background border-border/10 flex size-6 min-h-6 min-w-6 items-center justify-center rounded-sm border text-sm'>
                                                            6
                                                        </span>
                                                        <span className='bg-background border-border/10 flex size-6 min-h-6 min-w-6 items-center justify-center rounded-sm border text-sm'>
                                                            3
                                                        </span>
                                                        <span className='bg-background border-border/10 flex size-6 min-h-6 min-w-6 items-center justify-center rounded-sm border text-sm'>
                                                            1
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='grid w-full gap-2 pb-4'>
                                                <div className='flex w-full items-center justify-between'>
                                                    <div className='flex items-center gap-2'>
                                                        <span className='!text-text-secondary text-p-sm'>
                                                            Send Time (days)
                                                        </span>
                                                    </div>
                                                    <span className='flex h-6 items-center justify-center rounded-sm px-2 text-sm'>
                                                        09:00
                                                    </span>
                                                </div>
                                                <div className='flex w-full items-center justify-between'>
                                                    <div className='flex items-center gap-2'>
                                                        <span className='!text-text-secondary text-p-sm'>Fallback</span>
                                                    </div>
                                                    <span className='flex h-6 items-center justify-center rounded-sm px-2 text-sm'>
                                                        On
                                                    </span>
                                                </div>
                                                <div className='flex w-full items-center justify-between'>
                                                    <div className='flex items-center gap-2'>
                                                        <span className='!text-text-secondary text-p-sm'>
                                                            Anti-Spam
                                                        </span>
                                                    </div>
                                                    <span className='flex h-6 items-center justify-center rounded-sm px-2 text-sm'>
                                                        On
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className='flex w-full shrink-0 justify-between gap-2 sm:mt-1 sm:w-auto sm:gap-4 lg:hidden'>
                                <Button
                                    variant='outline'
                                    onClick={() => router.push(PATHS.dashboard())}
                                    className='flex-1 sm:flex-none'
                                >
                                    Back
                                </Button>
                                <Button
                                    variant='primary'
                                    className='w-auto min-w-[40px] flex-1 sm:w-fit sm:flex-none'
                                    onClick={handleCreateOrganization}
                                >
                                    <Plus className='stroke-text-foreground !size-5 sm:!size-4' />
                                    <span className='ml-2 text-current'>Create</span>
                                    <span className='hidden text-current md:inline'>&nbsp;{title}</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

```

## Description

This file is part of the MedicHub Frontend (Next.js) application.

### File Purpose
[Auto-generated documentation - please review and update]

### Key Exports
[Auto-detected from code analysis]

### Dependencies
[Auto-detected from imports]

---

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.154Z*
