import { APP_NAME, CLIENT_URL, COMPANY_NAME, type I18nService, PATHS, SUPPORT_EMAIL } from "@/core";

import {
  Body,
  Button,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text
} from "@react-email/components";

export interface IProps {
  token: string;
  i18n?: I18nService;
  language?: string;
}

export function VerificationEmailTemplate({
  token, i18n, language='en'
}: IProps) {
    const currentYear: number = new Date().getFullYear()
    const verifyUrl: string = PATHS.VERIFY_EMAIL(CLIENT_URL, token)
    const t = i18n.t('mail.verification_email')

    return (
        <Html lang={language}>
            <Preview>{t('preview') || "Confirm your email to finish signing up."}</Preview>
            <Tailwind>
                <Head />
                <Body className="bg-[#efefef] max-w-[600px] m-auto py-3 px-3">
                    {/* Логотип */}
                    <div className="bg-white h-fit px-4 py-6 rounded-md space-y-4 text-center">
                        <Section>
                            {/*[if mso]><div style="font-family:Segoe UI, Arial, sans-serif; font-size:20px; font-weight:700; color:#143394">{companyName}</div><![endif]*/}
                            <div className="h-12 flex justify-center items-center" role="svg" aria-label={COMPANY_NAME}>
                                <Img
                                    src='https://res.cloudinary.com/dki4lxdki/image/upload/v1759181992/doctorlab/app/logo-full.png' 
                                    width="180"
                                    height="44"
                                    alt={COMPANY_NAME}
                                    style={{ display: "block", margin: "0 auto", border: "0", outline: "none", textDecoration: "none" }}
                                />
                            </div>
                        </Section>

                        <Section className="font-sans tracking-wide font-normal text-[#222222] mb-2 px-2">
                            <Heading as="h2" className="text-center">{t('title') || "Verify your email address"}</Heading>

                            <Text className="text-center">{t('intro', {app: APP_NAME}) || `Please confirm that you’d like to use this email address for your ${APP_NAME} account. Once confirmed, you’ll be able to start using ${APP_NAME}.`}</Text>
                        </Section>

                        <Button
                            className="box-border w-fit rounded-lg m-auto bg-[#2B7AFF] px-6 py-3 text-center font-normal font-sans traking-wider text-white"
                            href={verifyUrl}
                        >
                            {t('cta') || "Verify email"}
                        </Button>
                        
                        <Section className="text-center px-2 mt-4">
                            <Text className="text-center font-sans tracking-wide font-normal text-[#222222] m-0">{t('copyLinkHint') || "Or paste this link into your browser:"}</Text>
                            <Link href={verifyUrl} className="font-sans tracking-[0px] text-center text-sm w-full" >{verifyUrl}</Link>
                        </Section>
                    </div>

                    <Section className="px-1 pt-4">
                        <Text className="m-0 text-xs text-[#656565]">
                         {t('signature')[0] || "Regards, the"} <span className="font-semibold text-[#143394]">{t('signature', {company: COMPANY_NAME})[1] || `${COMPANY_NAME} team`}</span>
                        </Text>
                        <Text className="mt-2 text-xs text-[#656565]">
                            {t('supportNote') || "This is an automated message; please do not reply. Contact support: "}
                        <Link href={`mailto:${SUPPORT_EMAIL}`} className="text-[#656565] underline">
                            {SUPPORT_EMAIL}
                        </Link>
                        </Text>
                        <Text className="font-sans leading-[14px] font-normal text-[#656565] text-xs mb-2">
                            {t('legalNote', { app: APP_NAME}) || `You're receiving this email because you created a ${APP_NAME} account. If you didn’t request this, you can safely ignore this email.`}
                        </Text>
                    </Section>

                    <Section className="text-center px-2">
                        <Text className="font-sans tracking-wide font-normal text-[#656565] text-xs mb-4">{t('copyright', {year: currentYear, company: APP_NAME }) || `© ${currentYear} ${APP_NAME}. All rights reserved.`}</Text>
                        {/*[if mso]><div style="font-family:Segoe UI, Arial, sans-serif; font-size:20px; font-weight:700; color:#143394">{companyName}</div><![endif]*/}
                        <div className="size-12 flex justify-center items-center  m-auto" role="img" aria-label={COMPANY_NAME}>
                            <Img
                                src='https://res.cloudinary.com/dki4lxdki/image/upload/v1759181993/doctorlab/app/logo-mini.png' 
                                width="44"
                                height="44"
                                alt={COMPANY_NAME}
                                style={{ display: "block", margin: "0 auto", border: "0", outline: "none", textDecoration: "none" }}
                            />
                        </div>
                    </Section>
                </Body>
            </Tailwind>
        </Html>
    );
}