import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    brand: {
      deepGreen: string;
      warmYellow: string;
      skyBlue: string;
      charcoalGray: string;
      lightGray: string;
    };
    recycle: {
      paper: string;
      plastic: string;
      glass: string;
      metal: string;
      organic: string;
      ewaste: string;
    };
    landing: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
      sections: {
        hero: GradientSection;
        features: FeaturesSection;
        about: GradientSection;
        partners: PartnersSection;
        footer: FooterSection;
        buttons: ButtonsSection;
      };
    };
    landingGradient: {
      from: string;
      to: string;
    };
  }

  interface PaletteOptions {
    brand?: Palette["brand"];
    recycle?: Palette["recycle"];
    landing?: Palette["landing"];
    landingGradient?: Palette["landingGradient"];
  }

  interface Theme {
    gradients: any;
    customShadows: any;
  }

  interface ThemeOptions {
    gradients?: any;
    customShadows?: any;
  }
}

interface GradientSection {
  gradientFrom: string;
  gradientTo: string;
  text: string;
}

interface FeaturesSection {
  background: string;
  cardBackgroundFrom: string;
  cardBackgroundTo: string;
  text: string;
  cardTitle: string;
}

interface PartnersSection {
  background: string;
  text: string;
  highlight: string;
}

interface FooterSection {
  background: string;
  sectionBackground: string;
  text: string;
  border: string;
  accent: string;
}

interface ButtonsSection {
  background: string;
  text: string;
  hoverShadow: string;
}
