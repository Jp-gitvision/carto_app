const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github2").Strategy;
// const FacebookStrategy = require("passport-facebook").Strategy;


const passport = require("passport");

const GOOGLE_CLIENT_ID = "1003457025859-p206n4dslf0aed3u18abdge8lpk5peg2.apps.googleusercontent.com"
// ici c'est le code ID client lorsque l'on crée un identifiant 0auth2.0 : https://console.cloud.google.com/apis/credentials?highlightClient=1003457025859-p206n4dslf0aed3u18abdge8lpk5peg2.apps.googleusercontent.com&authuser=2&hl=fr&project=my-project-lama-dev-419313
const GOOGLE_CLIENT_SECRET = "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"
// Même chose mais pour le code secret du client : https://console.cloud.google.com/apis/credentials?highlightClient=1003457025859-p206n4dslf0aed3u18abdge8lpk5peg2.apps.googleusercontent.com&authuser=2&hl=fr&project=my-project-lama-dev-419313

GITHUB_CLIENT_ID = "3643764f0c53bcaa382f";
// Même chose pour GITHUB : https://github.com/settings/developers
GITHUB_CLIENT_SECRET = "c03cddcdc9954adfce804975cb1303bf5d115551";

// FACEBOOK_APP_ID = "";
// FACEBOOK_APP_SECRET = "";

passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      function (accessToken, refreshToken, profile, done) {
        done(null, profile);
      }
    )
  );

  passport.use(
    new GithubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: "/auth/github/callback",
      },
      function (accessToken, refreshToken, profile, done) {
        done(null, profile);
      }
    )
  );

//   passport.use(
//     new FacebookStrategy(
//       {
//         clientID: FACEBOOK_APP_ID,
//         clientSecret: FACEBOOK_APP_SECRET,
//         callbackURL: "/auth/facebook/callback",
//       },
//       function (accessToken, refreshToken, profile, done) {
//         done(null, profile);
//       }
//     )
//   );
  
  
passport.serializeUser((user, done) => {
done(null, user);
});

passport.deserializeUser((user, done) => {
done(null, user);
});