class IconsPicker {
  constructor(dictIcons) {
    this.dictIcons = dictIcons;
    this.element = $(".iconsPicker");
    this.iconsSrc = this.element.attr("iconsSrc");
  }

  _createDropdownButton(style = "light") {
    const imgURL = `${this.iconsSrc}/default/${this.dictIcons["default"]}`;
    const dropdownButton = `<button class="btn btn-${style} dropdown-toggle" type="button" id="dropdownMenuButton"
        data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
        <img src="${imgURL}" alt="Default icon for icons picker">
    </button>`;
    this.element.append(dropdownButton);
  }

  _createNavTabs() {
    let navItem = "";

    for (const property in this.dictIcons) {
      if (property !== "default") {
        navItem += `<div class="col">
            <li class="nav-item">
                <a class="nav-link" data-bs-toggle="collapse" href="#collapse${property}" role="button"
                    aria-expanded="false" aria-controls="collapse${property}">
                    ${property}
                </a>
            </li>
        </div>`;
      }
    }

    return `<div class="row">
        <ul class="nav nav-tabs">
            ${navItem}
        </ul>
    </div>`;
  }

  _createDropdownItem(property, numberItemsPerRow = 3) {
    let dropdownItem = "";
    let imgURL = "";
    let counterItemsPerRow = 0;

    for (const [index, icon] of this.dictIcons[property].entries()) {
      if (property !== "default") {
        imgURL = `${this.iconsSrc}/${property}/${icon}`;
        if (index % numberItemsPerRow == 0) {
          dropdownItem += '<div class="row">';
        }

        dropdownItem += `<div class="col dropdown-item"><img
            src="${imgURL}" alt="${property} icon."></div>`;
        counterItemsPerRow++;
        if (counterItemsPerRow == numberItemsPerRow || index == this.dictIcons[property].length - 1) {
          counterItemsPerRow = 0;
          dropdownItem += "</div>";
        }
      }
    }

    return dropdownItem;
  }

  _createCollapses() {
    let collapses = "";

    for (const property in this.dictIcons) {
      if (property !== "default") {
        collapses += `<div class="collapse" id="collapse${property}">
          ${this._createDropdownItem(property, 3)}
        </div>`;
      }
    }

    return collapses;
  }

  _createDropdownMenu() {
    const dropdownMenu = `<div class="dropdown-menu">${this._createNavTabs()}${this._createCollapses()}</div>`;
    this.element.append(dropdownMenu);
  }

  _toRemoveShowClass(property) {
    let removeShowClass = "";
    for (const propertyToHide in this.dictIcons) {
      if (propertyToHide !== property && propertyToHide !== "default") {
        removeShowClass += `document.getElementById("collapse${propertyToHide}").classList.remove("show");`
      }
    }
    return removeShowClass;
  }

  _addEvents() {
    let scriptEvents = "<script type='text/javascript'>";

    for (const property in this.dictIcons) {
      if (property !== "default") {
        scriptEvents += `const collapse${property} = document.getElementById("collapse${property}");
        collapse${property}.addEventListener("show.bs.collapse", () => {
          ${this._toRemoveShowClass(property)}
        });`;
      }
    }

    scriptEvents += `const imgDropdownItems = document.querySelectorAll(".dropdown-item img");
    for(const imgItem of imgDropdownItems){
      imgItem.addEventListener("click", event => {
        document.querySelector("#dropdownMenuButton img").src = event.target.src;
      });
    }`;

    scriptEvents += "</script>";
    $('body').append(scriptEvents);
  }

  createIconsPicker(style = "light") {
    this._createDropdownButton(style);
    this._createDropdownMenu();
    this._addEvents();
  }

  getUrlImgChoose() {
    return $("#dropdownMenuButton img").attr("src");
  }
}
