import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text
} from "@react-email/components";

export interface verificationEmailProps {
  url: string;
  companyName?: string;
  supportEmail?: string;
}

const APP_NAME = 'DoctorLab'
const COMPANY_NAME = 'MedicHub Inc.'
const SUPPORT_EMAIL = "support@example.com"

export default function verificationEmail({
  url = "http://localhost:3000/auth/verify?token=exampletoken",
}: verificationEmailProps) {
    return (
       <Html lang='en'>
            <Preview>{"Confirm your email to finish signing up."}</Preview>
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

                        <Section className="font-sans tracking-wide font-normal text-[#222222]">
                            <Heading as="h2" className="text-center">{"Verify your email address"}</Heading>

                             <Text className="text-center">{`We received a request to reset the password for your ${APP_NAME} account. If it was you, click the button below to choose a new password.`}</Text>
                        </Section>

                        <Button
                            className="box-border w-fit rounded-lg m-auto bg-[#2B7AFF] px-6 py-3 text-center font-normal font-sans traking-wider text-white"
                            href={url}
                        >
                            {"Create new password"}
                        </Button>
                
                        <Section className="text-center px-2 mt-4">
                            <Text className="text-center font-sans tracking-wide font-normal text-[#222222] m-0">{"Or paste this link into your browser:"}</Text>
                            <Link href={url} className="font-sans tracking-[0px] text-center text-sm w-full" >{url}</Link>
                        </Section>
                    </div>

                    <Section className="px-1 pt-4">
                        <Text className="m-0 text-xs text-[#656565]">
                         {"Regards, the"} <span className="font-semibold text-[#143394]">{`${COMPANY_NAME} team`}</span>
                        </Text>
                        <Text className="mt-2 text-xs text-[#656565]">
                            {"This is an automated message; please do not reply. Contact support: "}
                        <Link href={`mailto:${SUPPORT_EMAIL}`} className="text-[#656565] underline">
                            {SUPPORT_EMAIL}
                        </Link>
                        </Text>
                        <Text className="font-sans leading-[14px] font-normal text-[#656565] text-xs mb-2">
                            {`You're receiving this email because you created a ${APP_NAME} account. If you didn’t request this, you can safely ignore this email.`}
                        </Text>
                    </Section>

                    <Section className="text-center px-2">
                        <Text className="font-sans tracking-wide font-normal text-[#656565] text-xs mb-4">{`© ${2025} ${APP_NAME}. All rights reserved.`}</Text>
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