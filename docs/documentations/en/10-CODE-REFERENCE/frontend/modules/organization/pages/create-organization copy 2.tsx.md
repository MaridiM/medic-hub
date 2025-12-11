# File: modules\organization\pages\create-organization copy 2.tsx

## Location
`G:/Projects/doctor_lab/medic_hub_gemini/apps/web/src/modules/organization/pages/create-organization copy 2.tsx`

## Category
Frontend

## File Type
TSX (create-organization copy 2.tsx)

## Size
39948 characters, 661 lines

## Full Code

```typescript
'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, ChevronUp, Info, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { mockUser } from '@/packages/api/mocks'
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Header,
    Input,
    Label,
    MultiSelect,
    Option,
    PresetOrCustomInput,
    SingleSelect,
    Textarea
} from '@/packages/components'
import { PATHS } from '@/packages/config'
import { getCurrentLanguage, languages } from '@/packages/libs/i18n'
import { cn } from '@/packages/utils'

import { OrgTypeIcon, SpecialistTypeIcon } from '../shared/assets'
import { useResolvedSettings } from '../shared/hooks'

type TMode = 'organization' | 'specialist'

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

    const handlePreview = () => {
        console.log('Will be saved to the server:', {
            language: resolved.language,
            timezone: resolved.timezone,
            currency: resolved.currency,
            firstDayOfWeek: resolved.firstDayOfWeek,
            businessHours: businessHours !== 'auto' ? businessHours : 'auto (not saved)'
        })
    }

    const handleCreateOrganization = async () => {
        handlePreview() // !TEST
        const payload = {
            // name: clinicName,
            // specializations,
            // email: invoiceEmail,
            // phone: bookingPhone,
            // city,
            // address: fullAddress,
            // description: description || null,

            // ← Отправляем на сервер уже реальные значения!
            language: resolved.language,
            timezone: resolved.timezone,
            currency: resolved.currency,
            firstDayOfWeek: resolved.firstDayOfWeek,

            // businessHours сохраняем только если пользователь выбрал конкретное время
            ...(businessHours !== 'auto' && { businessHours })
        }

        console.log('Creating organization with resolved settings:', payload)
        // await api.organization.create(payload)
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
        setWorkExperience('') // Clear value when switching modes
    }

    return (
        <div className='flex min-h-0 w-full flex-1 flex-col overflow-hidden'>
            <Header user={mockUser} />
            <div className='flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-2'>
                <header className='flex w-full items-center gap-1 px-2'>
                    <div className='pt-[3px]'>
                        {mode === 'specialist' ? (
                            <SpecialistTypeIcon className='h-[80px] min-w-[46px]' />
                        ) : (
                            <OrgTypeIcon className='h-[80px] min-w-[46px]' />
                        )}
                    </div>
                    <div className='flex w-full flex-col gap-1 px-2'>
                        <div className='flex items-center justify-between gap-4'>
                            <h1 className='text-text text-h3 min-w-fit font-medium'>
                                {mode === 'specialist' ? 'Specialist Setup' : 'Organization Setup'}
                            </h1>
                            <div className='flex gap-4'>
                                <div className='flex gap-4'>
                                    <Button variant='outline' onClick={() => router.push(PATHS.dashboard())}>
                                        Back
                                    </Button>
                                    <Button
                                        variant='primary'
                                        className='w-10 min-w-10 md:w-fit md:min-w-fit'
                                        onClick={handleCreateOrganization}
                                    >
                                        <Plus
                                            className='stroke-text-foreground !size-6 md:!size-4'
                                            onClick={() => console.log('CREATE ORGANIZATION')}
                                        />
                                        <span className='hidden text-current md:block'>Create Organization</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <p className='text-text-secondary text-p flex max-w-[700px] flex-col items-center'>
                            {mode === 'specialist'
                                ? 'Ideal for private practitioners — doctors, dentists, or cosmetologists — who manage appointments independently without administrative staff. All tools for working with patients in one place.'
                                : 'For clinics or medical centers with multiple offices and specialist teams. Centralized management of schedules, staff, and finances.'}
                        </p>
                    </div>
                </header>

                <div className='flex flex-1 justify-center px-2 pb-4'>
                    <Card className='h-fit w-full max-w-[800px]'>
                        <CardHeader className='flex flex-col gap-0'>
                            <div className='flex w-full gap-4'>
                                <h3 className='text-text text-h4 w-full min-w-fit font-medium'>Basic Information</h3>
                                <div className='flex min-w-fit items-center gap-2'>
                                    <Info className='stroke-text-tertiary h-4 w-4' />
                                    <span className='text-text-tertiary min-w-fit pt-px'>Can be changed later</span>
                                </div>
                            </div>
                            <span className='text-text-secondary text-p-sm'>
                                This data will appear in the patient profile, contracts, invoices, and reminders.
                            </span>
                        </CardHeader>
                        <CardContent className='flex flex-col gap-4'>
                            {/* Work Format */}
                            <div className='flex w-full flex-col gap-2'>
                                <header className='flex w-full'>
                                    <span className='text-text text-p-md w-full min-w-fit font-medium'>
                                        Work Format
                                    </span>
                                </header>
                                <div className='grid w-full gap-4 md:grid-cols-2'>
                                    {/* Specialist */}
                                    <div
                                        onClick={() => setMode('specialist')}
                                        className={cn(
                                            'cursor-pointer rounded-xl border p-4 transition-all duration-500 select-none',
                                            mode === 'specialist'
                                                ? 'border-primary/10 bg-primary/5 ring-primary opacity-100 shadow-lg ring-2'
                                                : 'border-border/10 bg-surface/50 hover:border-border/40 opacity-75'
                                        )}
                                    >
                                        <div className='flex items-center justify-between'>
                                            <h3 className='text-h5 text-text font-medium'>Specialist</h3>

                                            {/* Плавное появление чекбокса — идеально */}
                                            <AnimatePresence mode='wait'>
                                                {mode === 'specialist' && (
                                                    <motion.div
                                                        initial={{ scale: 0, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        exit={{ scale: 0, opacity: 0 }}
                                                        transition={{
                                                            type: 'spring',
                                                            stiffness: 500,
                                                            damping: 30
                                                        }}
                                                        className='bg-primary flex h-5 w-5 items-center justify-center rounded-full'
                                                    >
                                                        <Check className='stroke-text-foreground h-3.5 w-3.5 stroke-[2.5]' />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        <p className='text-p-xs text-text-secondary mt-3 leading-relaxed'>
                                            Designed for solo doctors, dentists, or cosmetologists who manage all visits
                                            without staff.
                                        </p>
                                        <p className='text-p-xs text-primary mt-3 leading-relaxed'>
                                            office • no staff • individual practice
                                        </p>
                                    </div>

                                    {/* Organization */}
                                    <div
                                        onClick={() => setMode('organization')}
                                        className={cn(
                                            'cursor-pointer rounded-xl border p-4 transition-all duration-500 select-none',
                                            mode === 'organization'
                                                ? 'border-primary/10 bg-primary/5 ring-primary opacity-100 shadow-lg ring-2'
                                                : 'border-border/10 bg-surface/50 hover:border-border/40 opacity-75'
                                        )}
                                    >
                                        <div className='flex items-center justify-between'>
                                            <h3 className='text-h5 text-text font-medium'>Organization</h3>

                                            <AnimatePresence mode='wait'>
                                                {mode === 'organization' && (
                                                    <motion.div
                                                        initial={{ scale: 0, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        exit={{ scale: 0, opacity: 0 }}
                                                        transition={{
                                                            type: 'spring',
                                                            stiffness: 500,
                                                            damping: 30
                                                        }}
                                                        className='bg-primary flex h-5 w-5 items-center justify-center rounded-full'
                                                    >
                                                        <Check className='stroke-text-foreground h-3.5 w-3.5 stroke-[2.5]' />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        <p className='text-p-xs text-text-secondary mt-3 leading-relaxed'>
                                            Designed for clinics and medical centers with multiple offices and teams in
                                            one system.
                                        </p>
                                        <p className='text-p-xs text-primary mt-3 leading-relaxed'>
                                            1+ offices • staff • role and permission management
                                        </p>
                                    </div>
                                </div>
                                <p className='text-p-xs text-text-tertiary mt-3 text-center'>
                                    You can change this at any time in organization settings
                                </p>
                            </div>
                            {/* Basic Information */}
                            <div className='flex w-full flex-col gap-2'>
                                <header className='flex w-full'>
                                    <span className='text-text text-p-md w-full min-w-fit font-medium'>
                                        Basic Information
                                    </span>
                                </header>

                                <div className='grid w-full gap-2 md:grid-cols-2'>
                                    <div className='flex flex-col gap-1'>
                                        <Label className='!text-text-secondary text-p-sm'>
                                            Clinic Name <span className='text-negative'>*</span>
                                        </Label>
                                        <Input placeholder='Aesthetic Clinic' />
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <Label className='!text-text-secondary text-p-sm'>
                                            Profile / Specialization <span className='text-negative'>*</span>
                                        </Label>
                                        <MultiSelect
                                            options={specializationOptions}
                                            value={specializations}
                                            onChange={setSpecializations}
                                            placeholder='Dentist / Cosmetologist / Dermatologist / Other'
                                            searchPlaceholder='Search specialization...'
                                            emptyText='Specialization not found'
                                            searchable
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contacts */}
                            <div className='flex w-full flex-col gap-2'>
                                <header className='flex w-full'>
                                    <span className='text-text text-p-md w-full min-w-fit font-medium'>Contacts</span>
                                </header>

                                <div className='grid w-full gap-2 md:grid-cols-2'>
                                    <div className='flex flex-col gap-1'>
                                        <Label className='!text-text-secondary text-p-sm'>
                                            E-mail (for invoices/documents) <span className='text-negative'>*</span>
                                        </Label>
                                        <Input placeholder='clinic@example.com' />
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <Label className='!text-text-secondary text-p-sm'>
                                            Booking Phone (E.164) <span className='text-negative'>*</span>
                                        </Label>
                                        <Input placeholder='+123XXXXXXXXX' />
                                    </div>
                                </div>
                            </div>

                            {/* Address */}
                            <div className='flex w-full flex-col gap-2'>
                                <header className='flex w-full'>
                                    <span className='text-text text-p-md w-full min-w-fit font-medium'>Address</span>
                                </header>

                                <div className='grid w-full gap-2 md:grid-cols-2'>
                                    <div className='flex flex-col gap-1'>
                                        <Label className='!text-text-secondary text-p-sm'>
                                            City / Location <span className='text-negative'>*</span>
                                        </Label>
                                        <Input placeholder='Kyiv, Troieshchyna' />
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <Label className='!text-text-secondary text-p-sm'>
                                            Office / Clinic Address <span className='text-negative'>*</span>
                                        </Label>
                                        <Input placeholder='Aesthetic Clinic, 10 Shevchenko St.' />
                                    </div>
                                </div>
                            </div>

                            {/* Regional & Time Settings */}
                            <div className='flex w-full flex-col gap-2'>
                                <header className='flex w-full'>
                                    <span className='text-text text-p-md w-full min-w-fit font-medium'>
                                        Regional & Time Settings
                                    </span>
                                </header>

                                <div className='flex w-full flex-col gap-2'>
                                    <div className='grid w-full gap-2 md:grid-cols-2'>
                                        <div className='flex flex-col gap-1'>
                                            <Label className='!text-text-secondary text-p-sm'>Language / Locale</Label>
                                            <SingleSelect
                                                options={languageOptions}
                                                value={language}
                                                onChange={setLanguage}
                                                placeholder='Select language...'
                                                searchPlaceholder='Search language...'
                                                emptyText='Language not found'
                                            />
                                        </div>
                                        <div className='flex flex-col gap-1'>
                                            <Label className='!text-text-secondary text-p-sm'>
                                                Time zone (organizations/branches)
                                            </Label>
                                            <SingleSelect
                                                options={timezoneOptions}
                                                value={timezone}
                                                onChange={setTimezone}
                                                placeholder='Select timezone...'
                                                searchPlaceholder='Search timezone...'
                                                emptyText='Timezone not found'
                                                searchable
                                            />
                                        </div>
                                    </div>

                                    <div className='grid w-full gap-2 md:grid-cols-2'>
                                        <div className='flex flex-col gap-1'>
                                            <Label className='!text-text-secondary text-p-sm'>First day of week</Label>
                                            <SingleSelect
                                                options={weekdayOptions}
                                                value={firstDayOfWeek}
                                                onChange={setFirstDayOfWeek}
                                                placeholder='Select first day...'
                                                searchPlaceholder='Search day...'
                                                emptyText='Day not found'
                                            />
                                        </div>
                                        <div className='flex flex-col gap-1'>
                                            <Label className='!text-text-secondary text-p-sm'>
                                                Default business hours
                                            </Label>
                                            <SingleSelect
                                                options={businessHoursOptions}
                                                value={businessHours}
                                                onChange={setBusinessHours}
                                                placeholder='Select business hours...'
                                                searchPlaceholder='Search hours...'
                                                emptyText='Hours not found'
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional */}
                            <div className='flex w-full flex-col gap-2'>
                                <header className='flex w-full min-w-fit items-center'>
                                    <span className='text-text text-p-md w-full min-w-fit font-medium'>Additional</span>
                                    <Button
                                        className='text-text-secondary group h-auto min-w-fit cursor-pointer items-center gap-2 p-0'
                                        onClick={() => setShowAdvanced(!showAdvanced)}
                                    >
                                        {showAdvanced ? (
                                            <ChevronUp className='stroke-text-secondary group-hover:stroke-text !size-4 transition-colors' />
                                        ) : (
                                            <ChevronDown className='stroke-text-secondary group-hover:stroke-text !size-4 transition-colors' />
                                        )}
                                        <span className='group-hover:text-text min-w-fit text-current transition-colors'>
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
                                            <div className='flex w-full flex-col gap-2'>
                                                <div className='grid w-full gap-2 md:grid-cols-2'>
                                                    <div className='flex flex-col gap-1'>
                                                        <Label className='!text-text-secondary text-p-sm'>
                                                            Registration Data / License{' '}
                                                            <span className='text-primary text-p-xs'>(optional)</span>
                                                        </Label>
                                                        <Input placeholder='License number' />
                                                    </div>
                                                    <div className='flex flex-col gap-1'>
                                                        <Label className='!text-text-secondary text-p-sm'>
                                                            Currency{' '}
                                                            <span className='text-primary text-p-xs'>(optional)</span>
                                                        </Label>
                                                        <SingleSelect
                                                            options={currencyOptions}
                                                            value={currency}
                                                            onChange={setCurrency}
                                                            placeholder='Select currency...'
                                                            searchPlaceholder='Search currency...'
                                                            emptyText='Currency not found'
                                                            searchable
                                                        />
                                                    </div>
                                                </div>

                                                {/* Work Experience with Toggle Mode */}
                                                <div className='grid w-full gap-2 md:grid-cols-2'>
                                                    <div className='flex flex-col gap-1'>
                                                        <div className='flex items-center justify-between'>
                                                            <Label className='!text-text-secondary text-p-sm'>
                                                                Work Experience{' '}
                                                                <span className='text-primary text-p-xs'>
                                                                    (optional)
                                                                </span>
                                                            </Label>
                                                            <button
                                                                type='button'
                                                                onClick={toggleExperienceMode}
                                                                className='text-primary hover:text-primary/80 text-p-xs transition-colors hover:underline'
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
                                                            selectPlaceholder='Select experience range...'
                                                            selectEmptyText='No range found'
                                                            inputPlaceholder='Enter years of experience'
                                                            inputType='number'
                                                            min={0}
                                                            max={50}
                                                        />

                                                        {workExperience && (
                                                            <span className='text-text-tertiary text-p-xs'>
                                                                {workExperienceMode === 'preset'
                                                                    ? `Selected: ${workExperienceOptions.find(opt => opt.value === workExperience)?.label}`
                                                                    : `${workExperience} year${
                                                                          Number(workExperience) !== 1 ? 's' : ''
                                                                      } of experience`}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {/* второй столбец пустой — только для выравнивания сетки */}
                                                    <div className='hidden md:block' />
                                                </div>

                                                <div className='flex w-full flex-col gap-1'>
                                                    <Label className='!text-text-secondary text-p-sm'>
                                                        Description / Specialization{' '}
                                                        <span className='text-primary text-p-xs'>(optional)</span>
                                                    </Label>
                                                    <div className='relative'>
                                                        <Textarea
                                                            value={description}
                                                            onChange={e => setDescription(e.target.value)}
                                                            placeholder='Aesthetic dentistry, implantation, surgery. Operating since 2015.'
                                                            className={cn(
                                                                'text-p-sm min-h-[80px] w-full resize-none overflow-y-auto leading-5',
                                                                description.length > 0 &&
                                                                    description.length < MIN_DESCRIPTION_LENGTH &&
                                                                    'border-warning',
                                                                description.length >= MAX_DESCRIPTION_LENGTH &&
                                                                    'border-negative'
                                                            )}
                                                            maxLength={MAX_DESCRIPTION_LENGTH}
                                                            rows={4}
                                                        />
                                                    </div>
                                                    <div className='flex items-center justify-between'>
                                                        <span className='text-text-tertiary text-p-xs'>
                                                            {description.length === 0
                                                                ? 'Min. 50 characters recommended'
                                                                : description.length < MIN_DESCRIPTION_LENGTH
                                                                  ? `Add ${MIN_DESCRIPTION_LENGTH - description.length} more characters`
                                                                  : 'Good length ✓'}
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
                                                    {/* Прогресс-бар */}
                                                    <div className='bg-border/20 h-1 w-full overflow-hidden rounded-full'>
                                                        <div
                                                            className={cn(
                                                                'h-full transition-all duration-300',
                                                                descriptionProgress < 90 ? 'bg-positive' : 'bg-warning'
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

*Auto-generated documentation - Last updated: 2025-12-11T12:41:20.121Z*
