"use client";
import Grid from "@mui/material/Grid";
import Hero from "@/components/hero/Hero";
// import { Benefit } from "@/components/benefit";
import Feature18 from "@/components/feature/Feature18";
import Feature21 from "@/components/feature/Feature21";
import { Cta4, Cta5 } from "@/components/cta";
import { DynamicComponentType } from "@/enum";
import { Clientele3 } from "@/components/clientele";
import Faq6 from "@/components/faq/Faq6";
import branding from "@/branding.json";
import Typography from "@mui/material/Typography";
import { Footer7 } from "@/components/footer";
import Box from "@mui/material/Box";
function DescriptionLine() {
  return (
    <Typography variant="body2" sx={{ color: "text.secondary" }}>
      SakaTaka connects every player in the waste value chain. Waste collectors
      get the tools to serve communities better. Residents get reliable service
      and easy communication. Recyclers get consistent material supply.
      Communities get cleaner environments. When everyone&apos;s connected
      through one platform, waste stops being a problem and starts being an
      opportunity. Built in Kenya, designed for impact across Africa and beyond.{" "}
      {/* <Link href={branding.company.socialLink.discord} passHref>
        <MuiLink
          variant="caption"
          color="primary"
          component="a"
          underline="hover"
        >
          Join our journey!
        </MuiLink>
      </Link> */}
    </Typography>
  );
}

export default function Home(/* props: Props */) {
  const linkProps = { target: "_blank", rel: "noopener noreferrer" };
  const hero: any = {
    headLine: (
      <>
        Waste Collection
        <br />
        <Box component="span" sx={{ color: "#FFC107" }}>
          That Actually Works
        </Box>
      </>
    ),
    captionLine:
      "Powerful tools for waste collectors, community groups and recyclers. Better operations, clearer payments, real growth - because managing waste should be the easy part.",
    primaryBtn: {
      children: "Download App",
      href: "https://play.google.com/store/apps/details?id=co.ke.sakataka.sakataka&pcampaignid=web_share",
    },
    videoSrc: "/assets/videos/intro-thumbnail.mp4",
    videoThumbnail: "/assets/videos/thumbnails/intro-thumbnail.png",
  };

  // const benefit = {
  //   heading: "What You Get",
  //   caption: "",
  //   blockDetail: [
  //     {
  //       animationDelay: 0.1,
  //       counter: "Agent Management",
  //       defaultUnit: "+",
  //       caption:
  //         "Our dedicated Agent App allows garbage collection agents to easily update and track which households have paid for their monthly waste collection services. Each agent uses the app in the field to mark payments in real time. This feature ensures up-to-date records, improves service efficiency, and gives companies full visibility into collections across different areas..",
  //     },
  //     {
  //       animationDelay: 0.2,
  //       counter: "Business Management",
  //       defaultUnit: "+",
  //       caption:
  //         "Complete inventory tracking for equipment, supplies, and materials. Financial management tools to track expenses, revenue, and profitability. Everything you need to run your operation like a real business..",
  //     },
  //     {
  //       animationDelay: 0.2,
  //       counter: "Collection That Works",
  //       defaultUnit: "+",
  //       caption:
  //         "Schedule pickups, assign routes, track progress in real-time. Digital database of all your clients with their collection history and preferences. Turn collection day chaos into something you can actually manage, with updates that happen as the work gets done.",
  //     },
  //     {
  //       animationDelay: 0.2,
  //       counter: "Simple Payment System",
  //       defaultUnit: "+",
  //       caption:
  //         "Handle invoices, mobile money, and cash payments all in one place. Plus automatic reminders that keep money flowing without the awkward conversations.",
  //     },
  //     {
  //       animationDelay: 0.2,
  //       counter: "Clear Insights",
  //       defaultUnit: "+",
  //       caption:
  //         "Actionable reports for decision-makers, timely alerts so nobody misses pickups or payments. See what's working, spot problems early, make better choices.",
  //     },
  //     {
  //       animationDelay: 0.2,
  //       counter: "Recycling Marketplace",
  //       defaultUnit: "+",
  //       caption:
  //         "Connect with buyers, track valuable materials, turn waste streams into additional revenue. Yesterday's trash becomes a real income source.",
  //     },
  //     {
  //       animationDelay: 0.2,
  //       counter: "Instant Communication",
  //       defaultUnit: "+",
  //       caption:
  //         "Send updates to all your clients instantly—schedule changes, payment reminders, service announcements. Plus customers can notify you immediately when problems arise, so you can respond fast.",
  //     },
  //   ],
  // };

  const feature18 = {
    heading: "What You Get.",
    caption:
      "We’re on a mission to revolutionize waste management. Join us as we build a platform that empowers waste collectors and communities.",
    topics: [
      {
        icon: "tabler-sparkles",
        title: "Agent Management",
        title2: "Agent Management ",
        description:
          "Our dedicated Agent App allows garbage collection agents to easily update and track which households have paid for their monthly waste collection services. Each agent uses the app in the field to mark payments in real time. This feature ensures up-to-date records, improves service efficiency, and gives companies full visibility into collections across different areas.",
        image: "/assets/images/graphics/default/admin-dashboard.png",
        list: [
          { primary: "" },
          { primary: "" },
          { primary: "" },
          { primary: "" },
        ],
        actionBtn: { children: "Start Now", href: "/", ...linkProps },
        actionBtn2: { children: "More info", href: "/", ...linkProps },
      },
      {
        icon: "tabler-palette",
        title: "Business Management",
        title2: "Business Management",
        description:
          "Complete inventory tracking for equipment, supplies, and materials. Financial management tools to track expenses, revenue, and profitability. Everything you need to run your operation like a real business.",
        image: "/assets/images/graphics/default/admin-dashboard-2.png",
        list: [
          { primary: "" },
          { primary: "" },
          { primary: "" },
          { primary: "" },
        ],
        actionBtn: { children: "Start Now", href: "/", ...linkProps },
        actionBtn2: { children: "More info", href: "/", ...linkProps },
      },
      {
        icon: "tabler-rocket",
        title: "Collection That Works",
        title2: "Collection That Works",
        description:
          "Schedule pickups, assign routes, track progress in real-time. Digital database of all your clients with their collection history and preferences. Turn collection day chaos into something you can actually manage, with updates that happen as the work gets done.",
        image: "/assets/images/graphics/default/admin-dashboard-3.png",
        list: [
          { primary: "" },
          { primary: "" },
          { primary: "" },
          { primary: "" },
        ],
        actionBtn: { children: "Start Now", href: "/", ...linkProps },
        actionBtn2: { children: "More info", href: "/", ...linkProps },
      },
      {
        icon: "tabler-sparkles",
        title: "Simple Payment System",
        title2: "Simple Payment System",
        description:
          "Handle invoices, mobile money, and cash payments all in one place. Plus automatic reminders that keep money flowing without the awkward conversations.",
        image: "/assets/images/graphics/default/admin-dashboard.png",
        list: [
          { primary: "" },
          { primary: "" },
          { primary: "" },
          { primary: "" },
        ],
        actionBtn: { children: "Start Now", href: "/", ...linkProps },
        actionBtn2: { children: "More info", href: "/", ...linkProps },
      },
      {
        icon: "tabler-palette",
        title: "Clear Insights",
        title2: "Clear Insights",
        description:
          "Actionable reports for decision-makers, timely alerts so nobody misses pickups or payments. See what's working, spot problems early, make better choices.",
        image: "/assets/images/graphics/default/admin-dashboard-2.png",
        list: [
          { primary: "" },
          { primary: "" },
          { primary: "" },
          { primary: "" },
        ],
        actionBtn: { children: "Start Now", href: "/", ...linkProps },
        actionBtn2: { children: "More info", href: "/", ...linkProps },
      },
      {
        icon: "tabler-rocket",
        title: "Recycling Marketplace",
        title2: "Recycling Marketplace",
        description:
          "Connect with buyers, track valuable materials, turn waste streams into additional revenue. Yesterday's trash becomes a real income source.",
        image: "/assets/images/graphics/default/admin-dashboard-3.png",
        list: [
          { primary: "" },
          { primary: "" },
          { primary: "" },
          { primary: "" },
        ],
        actionBtn: { children: "Start Now", href: "/", ...linkProps },
        actionBtn2: { children: "More info", href: "/", ...linkProps },
      },
      {
        icon: "tabler-rocket",
        title: "Instant Communication",
        title2: "Instant Communication",
        description:
          "Send updates to all your clients instantly—schedule changes, payment reminders, service announcements. Plus customers can notify you immediately when problems arise, so you can respond fast.",
        image: "/assets/images/graphics/default/admin-dashboard-3.png",
        list: [
          { primary: "" },
          { primary: "" },
          { primary: "" },
          { primary: "" },
        ],
        actionBtn: { children: "Start Now", href: "/", ...linkProps },
        actionBtn2: { children: "More info", href: "/", ...linkProps },
      },
    ],
  };
  const feature21 = {
    heading: `Partners in Clean Communities`,
    caption:
      "Working with forward-thinking waste companies and community groups.",
    image: "/assets/images/graphics/hosting/dashboard-light.png",
    // primaryBtn: {
    //   children: "Find out more",
    //   href: "/",
    //   ...linkProps,
    // },
    // secondaryBtn: {
    //   children: "Start Now",
    //   href: "/",
    //   ...linkProps,
    // },
    features: [
      {
        animationDelay: 0.1,
        icon: "tabler-components",
        title: "Payments Made Simple",
      },
    ],
  };
  const cta4 = {
    headLine: "Want the inside scoop on new features?",
    primaryBtn: {
      children: "Stay Connected",
      href: "/",
      target: "_blank",
      rel: "noopener noreferrer",
    },
    profileGroups: {
      avatarGroups: [
        { avatar: "/assets/images/user/avatar1.png" },
        { avatar: "/assets/images/user/avatar2.png" },
        { avatar: "/assets/images/user/avatar3.png" },
        { avatar: "/assets/images/user/avatar4.png" },
        { avatar: "/assets/images/user/avatar5.png" },
        { avatar: "/assets/images/user/avatar6.png" },
      ],
      review:
        "We’re Kenyan-born and built to turn waste chaos into opportunity—for collectors, communities, and the planet.",
    },
    list: [
      { primary: "10+ Years Expertise" },
      { primary: "8k+ Satisfied Customers" },
      { primary: "Elite Envato Author" },
      { primary: "Timely Support, Guaranteed" },
      { primary: "Regular Updates Provided" },
      { primary: "Proven Industry Leader" },
    ],
    clientContent: "Join our journey!",
  };
  const clientele = {
    title:
      "Working with forward-thinking waste companies and community groups.",
    clienteleList: [
      {
        image: {
          component: "clientele/Dribbble",
          type: DynamicComponentType.IMAGE,
        },
      },
      {
        image: {
          component: "clientele/Reddit",
          type: DynamicComponentType.IMAGE,
        },
      },
      {
        image: { component: "clientele/Mui", type: DynamicComponentType.IMAGE },
      },
      {
        image: {
          component: "clientele/Devto",
          type: DynamicComponentType.IMAGE,
        },
      },
      {
        image: {
          component: "clientele/Envato",
          type: DynamicComponentType.IMAGE,
        },
      },
    ],
  };
  const cta5 = {
    label: "About Us",
    heading: "We’re on a mission to revolutionize waste management.",
    caption: "Powering The Waste Ecosystem",
    primaryBtn: {
      children: "Join our journey!",
      href: branding.company.socialLink.discord,
      target: "_blank",
      rel: "noopener noreferrer",
      color: "secondary",
    },
    description: <DescriptionLine />,
    saleData: {
      count: 8,
      defaultUnit: "+",
      caption: "Onboarded Waste Collectors",
    },
    profileGroups: {
      avatarGroups: [
        { avatar: "/assets/images/user/avatar5.png" },
        { avatar: "/assets/images/user/avatar2.png" },
        { avatar: "/assets/images/user/avatar3.png" },
        { avatar: "/assets/images/user/avatar4.png" },
        { avatar: "/assets/images/user/avatar6.png" },
        { avatar: "/assets/images/user/avatar1.png" },
      ],
      review:
        "We’re Kenyan-born and built to turn waste chaos into opportunity—for collectors, communities, and the planet.",
    },
  };

  const faq = {
    heading: "Frequently Asked Questions",
    caption:
      "Answers to common queries about our Waste Collection & Recycling Management System.",
    defaultExpanded: "Multi-Tenant Architecture",
    faqList: [
      {
        question: "What types of organizations can use this platform?",
        answer: `The system is built to support a wide range of users including Community Groups, Waste Management Companies, and Recycling Companies. Whether you're a small local group or a large-scale waste handler, the platform is built to scale and serve your specific needs.`,
        category: "General",
      },
      {
        question: "How does the multi-tenant architecture work?",
        answer: {
          content: `Each tenant operates in isolation with fully separate data and configuration.`,
          type: "list",
          data: [
            { primary: "Dedicated schema for each tenant." },
            {
              primary:
                "Individual settings like tax rates, waste categories, and branding.",
            },
            { primary: "Super Admin manages and oversees tenant activity." },
          ],
        },
        category: "Multi-Tenant Architecture",
      },
      {
        question: "Can tenants customize their environment?",
        answer: `Yes, tenants can customize billing cycles, waste categories, branding (logo, color, templates), and compliance settings. This allows the platform to adapt to various operational models.`,
        category: "Multi-Tenant Architecture",
      },
      {
        question: "What roles are available in the system?",
        answer: {
          content:
            "The system supports role-based access control with the following user types:",
          type: "list",
          data: [
            { primary: "Super Admin" },
            { primary: "Waste Management Company Admin" },
            { primary: "Community Group Admin" },
            { primary: "Recycling Company Admin" },
            { primary: "Agent" },
            { primary: "Customer" },
          ],
        },
        category: "User & Role Management",
      },
      {
        question: "Can a user have multiple roles?",
        answer: `Yes, the system supports multiple roles per user. For example, an agent can also be a customer. Access and permissions adjust accordingly.`,
        category: "User & Role Management",
      },
      {
        question: "How is waste collection managed?",
        answer: {
          content: "Collection is structured around regions and residences.",
          type: "list",
          data: [
            { primary: "Residences are assigned to regions." },
            { primary: "Agents manage collections per region." },
            {
              primary:
                "Supports ad-hoc and periodic (weekly/monthly) collection.",
            },
            { primary: "Route optimization is available." },
          ],
        },
        category: "Waste Collection",
      },
      {
        question: "Is the accounting system compliant with standards?",
        answer: {
          content:
            "Yes, it features double-entry accounting aligned with IFRS 9 standards.",
          type: "list",
          data: [
            { primary: "Debits and credits for every transaction." },
            {
              primary:
                "Chart of Accounts with assets, liabilities, revenue, and expenses.",
            },
            {
              primary:
                "Integrated financial reports: P&L, Balance Sheet, Cash Flow.",
            },
          ],
        },
        category: "Payments & Accounting",
      },
      {
        question: "What payment methods are supported?",
        answer: {
          content: "The platform integrates with multiple payment gateways.",
          type: "list",
          data: [
            { primary: "Mobile Money (e.g., M-Pesa)" },
            { primary: "Bank Transfers" },
            { primary: "Credit/Debit Cards" },
            { primary: "Cash (recorded by agents)" },
          ],
        },
        category: "Payments & Accounting",
      },
      {
        question: "How does the Recycling Marketplace work?",
        answer: {
          content:
            "Recyclables can be listed and purchased through the platform.",
          type: "list",
          data: [
            { primary: "Collection parties list categorized waste." },
            {
              primary: "Recycling companies can browse, buy, and rate sellers.",
            },
            { primary: "Supports bulk order aggregation and order tracking." },
          ],
        },
        category: "Recycling Marketplace",
      },
      {
        question: "What kind of reports are available?",
        answer: {
          content: "The platform provides rich dashboards and reporting tools.",
          type: "list",
          data: [
            { primary: "Waste collected per region and period." },
            { primary: "Revenue tracking, agent performance." },
            { primary: "Order fulfillment and recycling trends." },
            { primary: "Financial reports: P&L, Balance, Cash Flow." },
          ],
        },
        category: "Reports & Analytics",
      },
      {
        question: "How does the system handle communication?",
        answer: {
          content: "Automated and admin notifications are built-in.",
          type: "list",
          data: [
            {
              primary:
                "SMS & Email reminders for billing, collection schedules.",
            },
            { primary: "Push notifications for mobile users." },
            { primary: "Admin alerts for overdue invoices and pending tasks." },
          ],
        },
        category: "Communication & Notifications",
      },
      {
        question: "Is the system secure and compliant?",
        answer: {
          content:
            "Yes, it implements modern security and compliance features.",
          type: "list",
          data: [
            { primary: "JWT and OAuth2 for authentication." },
            { primary: "Audit logs for all key system actions." },
            { primary: "Data encryption for sensitive information." },
          ],
        },
        category: "Security & Compliance",
      },
      {
        question: "Can it integrate with external systems?",
        answer: {
          content: "Yes, APIs are available for third-party integration.",
          type: "list",
          data: [
            { primary: "Payment APIs (M-Pesa, Stripe, Bank APIs)" },
            { primary: "Email & SMS APIs (Twilio, SendGrid)" },
            { primary: "Government & compliance systems" },
            { primary: "Accounting tools like QuickBooks, Xero" },
          ],
        },
        category: "Integration & API",
      },
    ],
    getInTouch: {
      link: {
        children: "Contact Support",
        href: "csupport@sakataka.co.ke", // replace with actual support link
        target: "_blank",
        rel: "noopener noreferrer",
      },
    },
    categories: [
      "General",
      "Multi-Tenant Architecture",
      "User & Role Management",
      "Waste Collection",
      "Payments & Accounting",
      "Recycling Marketplace",
      "Communication & Notifications",
      "Reports & Analytics",
      "Security & Compliance",
      "Integration & API",
    ],
    activeCategory: "General",
  };

  return (
    <Box>
      <Grid
        container
        spacing={3}
        wrap="nowrap"
        direction="column"
        sx={{ height: "90vh", justifyContent: "space-between" }}
      >
        <Grid size="grow">
          {/* <Hero headLine={hero.headLine} /> */}
          <Hero
            headLine={hero.headLine}
            captionLine={hero.captionLine}
            primaryBtn={hero.primaryBtn}
            videoSrc={hero.videoSrc}
            videoThumbnail={hero.videoThumbnail}
            // listData={hero.listData}
          />

          {/* <Benefit
            heading={benefit.heading}
            caption={benefit.caption}
            blockDetail={benefit.blockDetail}
          /> */}
          <Feature18
            heading={feature18.heading}
            caption={feature18.caption}
            topics={feature18.topics}
          />
          <Cta5
            heading={cta5.heading}
            primaryBtn={cta5.primaryBtn}
            profileGroups={cta5.profileGroups}
            caption={cta5.caption}
            label={cta5.label}
            description={cta5.description}
            saleData={cta5.saleData}
          />
          <Feature21
            heading={feature21.heading}
            caption={feature21.caption}
            image={feature21.image}
            features={feature21.features}
            primaryBtn={/* feature21.primaryBtn */ null}
            secondaryBtn={/* feature21.secondaryBtn */ null}
          />
          <Clientele3
            title={clientele.title}
            clienteleList={clientele.clienteleList}
          />
          <Cta4
            headLine={cta4.headLine}
            primaryBtn={cta4.primaryBtn}
            profileGroups={cta4.profileGroups}
            clientContent={cta4.clientContent}
          />

          <Faq6
            heading={faq.heading}
            caption={faq.caption}
            faqList={faq.faqList.map((item) => ({
              question: item.question,
              answer:
                typeof item.answer === "string"
                  ? item.answer
                  : {
                      content: item.answer.content,
                      type: "list",
                      data: item.answer.data.map((dataItem) => ({
                        primary: dataItem.primary,
                      })),
                    },
              category: item.category,
            }))}
            getInTouch={faq.getInTouch}
            categories={faq.categories}
          />
        </Grid>
        {/* <MuiLink href="/privacy-policy">Privacy Policy</MuiLink> */}
        <Footer7 />
      </Grid>
    </Box>
  );
}
