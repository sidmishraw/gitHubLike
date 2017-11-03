/* node.js imports */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');                 // webpack plugin import
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");  // Extracts text and makes into a new file
/* node.js imports */

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin(
  {
    template: __dirname + '/src/app.html',
    filename: './bin/app.html',
    inject: 'body'
  }
);

module.exports = {
  entry: {
    // "github-components": path.join(__dirname, "/src/github-components.js"),
    // "github-colors": path.join(__dirname, "/src/github-colors.js"),
    "app": path.join(__dirname, "/src/app.js")
  },
  output: {
    filename: "./bin/github-like.bundle.js",
    libraryTarget: "var",            //  When your library is loaded, the return value of your entry point will be assigned to a variable
    library: "githubLike"            // name of the variable the library is exposed as
    // In this case it is exposed as "githubLike"
    // So, the consumer can just include the "github-like.bundle.js" in script tag
    // and then call the function like 
    // githubLike.GitHubCards.render("sidmishraw", "root", () => console.log("Done!"))
    // to render the cards.
  },
  externals: [            // externalizes the dependencies, forcing the user to have these in their projects
    "React",           // it is `React` that we are using from react.js, so the dependency is on `React`
    "Component",       // and so on. So the consumer needs to have these variables in their namespace or
    "ReactDOM",        // JS file to use this library. In my case, not externalizing in order 
    //to create a fat jar like bundle
    "jQuery"
  ],
  module: {
    loaders: [
      // css loaders
      {
        test: /\.css$/,
        loaders: ExtractTextWebpackPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ["env", 'react']            // babel recommends to use presets like this now
        }
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ["env", 'react']            // babel recommends to use presets like this now
        }
      }
    ]
  },
  plugins: [
    new ExtractTextWebpackPlugin(
      {
        filename: "./bin/styles.css",
        allChunks: true
      }
    ),
    HtmlWebpackPluginConfig
  ]
};