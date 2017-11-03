// # imports
import jQuery from 'jquery';
import { GitHubLangColors } from "./github-colors";
import React, { Component } from "react";
import ReactDOM from "react-dom";
// # imports

//# for export and internal usage
let gitHCards = {};
//# for export and internal usage

((function (gitHCards) {

  ///////////////////////////////////////////////////////
  ////////// GitHubProjectCard Component ////////////////
  ///////////////////////////////////////////////////////
  /**
   * A GitHub project card. It requires the following props to be set.
   * 
   * `name`:          The name of the project
   * 
   * `description`:   The description of the project
   * 
   * `url`:           The URL of the project repository in GitHub
   * 
   * `language`:      Primary programming language used in the Project
   * 
   * `udate`:         The last updated Date, is of type Date
   * 
   * `isFork`:        A boolean flag indicating if the project is a fork
   */
  class GitHubProjectCard extends Component {

    /**
     * Fetches the color for a language
     * @param {string} language The name of the language in lowercase
     */
    _detectLanguageColor(language) {
      // console.log("lang = " + language);
      if (language) {
        let color = GitHubLangColors[language]["color"];
        return (color ? color : "#ffffff");
      } else {
        return "#ffffff";
      }
    }

    /**
     * Renders the GitHubProjectCard component
     */
    render() {
      return (
        <li className="pinned-repo-item  p-3 mb-3 border border-gray-dark rounded-1">
          <div className="pinned-repo-item-content">
            <span className="d-block position-relative">
              <a href={this.props.url} className="text-bold">
                <span className="repo js-repo" title={this.props.name}>
                  {this.props.name}
                </span>
              </a>
            </span>
            <p className="text-gray text-small mb-2">
              {this.props.isFork ? "Forked" : ""}
            </p>
            <p className="pinned-repo-desc text-gray text-small d-block mt-2 mb-3">
              {this.props.description ? this.props.description : "No description provided"}
            </p>
            <p className="mb-0 f6 text-gray">
              <span className="repo-language-color pinned-repo-meta"
                style={{
                  backgroundColor: this._detectLanguageColor(this.props.language)
                }}>
              </span>
              {this.props.language ? this.props.language : ""}
            </p>
          </div>
        </li>
      );
    }

  }

  ///////////////////////////////////////////////////////////////////////////
  /////////////// GitHubCards Component /////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////
  /**
   * A GitHubCards component. It is the container that holds all the GitHubProjectCards in place.
   * It requires the following props to be set.
   * 
   * `user`:    It is the GitHub user name needed to fetch all the project repository information
   */
  class GitHubCards extends Component {

    /**
     * @param {object} props The props of the GitHubCards
     */
    constructor(props) {
      super(props);
      // # the initial state
      this.state = {
        projectCards: []
      };
      // # the initial state
      // # call for data fetch
      this._fetchGitHubProjects();
      // # call for data fetch
    }

    /**
     * Called when the component is just about to be mounted, just before the component's render() is called
     */
    componentWillMount() { }

    /**
     * Called right after the component's render() has been called, after the component is mounted
     */
    componentDidMount() { }

    /**
     * componentDidUpdate() is invoked immediately after updating occurs. This method is not called for the initial render.
     * @param {*} prevProps 
     * @param {*} prevState 
     */
    componentDidUpdate(prevProps, prevState) {
      // console.log(prevProps, prevState);
      // console.log("calling callback");
      this.props.callback();  // called only after component has mounted
    }

    /**
     * List of all the languages I like to dabble in!
     *
     * @param {*} projects My list of projects
     */
    _myLanguages(projects) {
      let languagesString = "";
      let langs = projects.map((prj) => prj["language"]);
      let l = [];
      for (let i = 0; i < langs.length; i++) {
        if (langs[i] && l.indexOf(langs[i]) == -1 && langs[i].length > 0) {
          l.push(langs[i]);
        }
      }
      languagesString = l.join(", ");
      return languagesString;
    }

    /**
     * <p>
     * Fetch the Sid's projects(repos) from GitHub. This should be done in the constructor of the component.
     * 
     * <p>
     * Another problem is that this function has an AJAX call inside, so the component needs to update after
     * the AJAX's success is called.
     */
    _fetchGitHubProjects() {
      /////////////////////////////////////
      // get the user from Component's props
      let user = this.props.user;
      /////////////////////////////////////
      // since the `this` inside the callback is not the component anymore,
      // need to close over it
      let component = this;
      /////////////////////////////////////
      jQuery.ajax({
        url: `https://api.github.com/users/${user}/repos?per_page=1000`,
        jsonp: true,
        method: "GET",
        dataType: "json",
        success: function (res) {
          if (typeof res === "object") {
            // res is an Array of objects
            gitHCards._languages = component._myLanguages(res);
            component.setState(
              {
                projectCards: component._sortByDate(res).map(component._constructProjectCards)
              }
            );
            // console.log(res);
            //////////////////////////////////////////////////
            // component.forceUpdate(() => console.log("done!"));
            //////////////////////////////////////////////////
          } else {
            console.log("Not a valid response, please contact Sid :)");
          }
        },
        error: function (e, status) {
          console.log(e, status);
        }
      });
    }

    /**
     * Constructs the GitHubProjectCards from information obtained from GitHub.
     * 
     * @param {object} fullProjectInfo The complete information about the project repo obtained from GitHub
     * 
     * @returns {GitHubProjectCard} a GitHubProjectCard JSX component
     */
    _constructProjectCards(fullProjectInfo) {
      return (
        <GitHubProjectCard
          key={fullProjectInfo["name"]}
          name={fullProjectInfo["name"]}
          description={fullProjectInfo["description"]}
          url={fullProjectInfo["html_url"]}
          language={fullProjectInfo["language"]}
          udate={new Date(fullProjectInfo["updated_at"])}
          isFork={fullProjectInfo["fork"]}
        />
      );
    }

    /**
     * Sort the projects by the last date I updated them!
     * 
     * @param {[project]} projects my list of projects obtained from GitHub
     */
    _sortByDate(projects) {
      return projects.sort((prj1, prj2) => new Date(prj2["updated_at"]) - new Date(prj1["updated_at"]));
    }

    /**
     * Renders this
     */
    render() {
      return (
        <ol className="pinned-repos-list mb-4">
          {this.state.projectCards}
        </ol>
      );
    }

  }

  /////////////////////////////////////////////////////////////////
  /////////////// Rendering Logic from here onwards ///////////////
  /////////////////////////////////////////////////////////////////
  gitHCards.render = function (userName, elementId, callback) {
    if (!userName || !elementId) {
      console.log("userName or elementId prop(s) not set");
      return;
    } else {
      ReactDOM.render(
        <GitHubCards user={userName} callback={callback} />,
        jQuery(`#${elementId}`).get(0)
      );
    }
  }

  /**
   * Gets my languages
   */
  gitHCards.getMyLanguages = function () {
    return gitHCards._languages;
  }
  /////////////////////////////////////////////////////////////////
})(gitHCards));

/////////////////////////////////////////
/////// Export logic ////////////////////
/////////////////////////////////////////
module.exports.GitHubCards = gitHCards;
/////////////////////////////////////////