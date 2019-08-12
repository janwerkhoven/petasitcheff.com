const isProduction = location.host === "www.petasitcheff.com" ? true : false;
const environment = isProduction ? "production" : "staging";

// Fire page view to Google Analytics
if (ga) {
  ga("create", "UA-34474019-10", "auto");
  ga("set", {
    dimension1: environment
  });
  ga("send", "pageview");
}
