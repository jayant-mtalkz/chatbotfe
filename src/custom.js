var id = document.getElementById("drawflow");
const editor = new Drawflow(id);
editor.reroute = true;
editor.reroute_fix_curvature = true;
editor.force_first_input = false;

/*
editor.createCurvature = function(start_pos_x, start_pos_y, end_pos_x, end_pos_y, curvature_value, type) {
  var center_x = ((end_pos_x - start_pos_x)/2)+start_pos_x;
  return ' M ' + start_pos_x + ' ' + start_pos_y + ' L '+ center_x +' ' +  start_pos_y  + ' L ' + center_x + ' ' +  end_pos_y  + ' L ' + end_pos_x + ' ' + end_pos_y;
}*/

//  const dataToImport =  {"drawflow":{"Home":{"data":{"1":{"id":1,"name":"start","data":{},"class":"start","html":"\n<div>\n  <div class=\"title-box\"><i class=\"fab fa-facebook\"></i> Start</div>\n</div>\n","typenode":false,"inputs":{},"outputs":{"output_1":{"connections":[]}},"pos_x":50,"pos_y":50},"2":{"id":2,"name":"end","data":{},"class":"end","html":"\n      <div>\n        <div class=\"title-box\" ><i class=\"fab fa-slack\"></i> Stop </div>\n     \n      </div>\n      ","typenode":false,"inputs":{"input_1":{"connections":[]}},"outputs":{},"pos_x":550,"pos_y":50},"3":{"id":3,"name":"slack","data":{},"class":"slack","html":"\n      <div>\n        <div class=\"title-box\" ><i class=\"fab fa-slack\"></i> Message</div>\n        <div class=\"setting-box\">\n          <i class=\"fa fa-cogs setting-icon\" data-bs-toggle=\"modal\" data-bs-target=\"#myModal\">\n        </div>\n      </div>\n      ","typenode":false,"inputs":{"input_1":{"connections":[]}},"outputs":{"output_1":{"connections":[]}},"pos_x":339,"pos_y":243}}}}}

var dataToImport = editor.export();
editor.start();
editor.import(dataToImport);

var start = `
<div>
  <div class="title-box"><i class="fab fa-facebook"></i> Start</div>
</div>
`;
editor.addNode("start", 0, 1, 50, 50, "start", {}, start);

var end = `
      <div>
        <div class="title-box" ><i class="fab fa-slack"></i> Stop </div>
     
      </div>
      `;

editor.addNode("end", 1, 0, 550, 50, "end", {}, end);

// Events!
editor.on("nodeCreated", function (id) {
  console.log("Node created " + id);
});

editor.on("nodeRemoved", function (id) {
  console.log("Node removed " + id);
});

editor.on("nodeSelected", function (id) {
  console.log("Node selected " + id);
});

editor.on("moduleCreated", function (name) {
  console.log("Module Created " + name);
});

editor.on("moduleChanged", function (name) {
  console.log("Module Changed " + name);
});

editor.on("connectionCreated", function (connection) {
  console.log("Connection created");
  console.log(connection);
});

editor.on("connectionRemoved", function (connection) {
  console.log("Connection removed");
  console.log(connection);
});
/*
editor.on('mouseMove', function(position) {
  console.log('Position mouse x:' + position.x + ' y:'+ position.y);
})
*/
editor.on("nodeMoved", function (id) {
  console.log("Node moved " + id);
});

editor.on("zoom", function (zoom) {
  console.log("Zoom level " + zoom);
});

editor.on("translate", function (position) {
  console.log("Translate x:" + position.x + " y:" + position.y);
});

editor.on("addReroute", function (id) {
  console.log("Reroute added " + id);
});

editor.on("removeReroute", function (id) {
  console.log("Reroute removed " + id);
});
/* DRAG EVENT */

/* Mouse and Touch Actions */

var elements = document.getElementsByClassName("drag-drawflow");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("touchend", drop, false);
  elements[i].addEventListener("touchmove", positionMobile, false);
  elements[i].addEventListener("touchstart", drag, false);
}

var mobile_item_selec = "";
var mobile_last_move = null;
function positionMobile(ev) {
  mobile_last_move = ev;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  if (ev.type === "touchstart") {
    mobile_item_selec = ev.target
      .closest(".drag-drawflow")
      .getAttribute("data-node");
  } else {
    ev.dataTransfer.setData("node", ev.target.getAttribute("data-node"));
  }
}

function drop(ev) {
  if (ev.type === "touchend") {
    var parentdrawflow = document
      .elementFromPoint(
        mobile_last_move.touches[0].clientX,
        mobile_last_move.touches[0].clientY
      )
      .closest("#drawflow");
    if (parentdrawflow != null) {
      addNodeToDrawFlow(
        mobile_item_selec,
        mobile_last_move.touches[0].clientX,
        mobile_last_move.touches[0].clientY
      );
    }
    mobile_item_selec = "";
  } else {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("node");
    addNodeToDrawFlow(data, ev.clientX, ev.clientY);
  }
}

function addNodeToDrawFlow(name, pos_x, pos_y) {
  if (editor.editor_mode === "fixed") {
    return false;
  }
  pos_x =
    pos_x *
      (editor.precanvas.clientWidth /
        (editor.precanvas.clientWidth * editor.zoom)) -
    editor.precanvas.getBoundingClientRect().x *
      (editor.precanvas.clientWidth /
        (editor.precanvas.clientWidth * editor.zoom));
  pos_y =
    pos_y *
      (editor.precanvas.clientHeight /
        (editor.precanvas.clientHeight * editor.zoom)) -
    editor.precanvas.getBoundingClientRect().y *
      (editor.precanvas.clientHeight /
        (editor.precanvas.clientHeight * editor.zoom));

  switch (name) {
    case "start":
      var start = `
    <div>
      <div class="title-box"><i class="fab fa-facebook"></i> start</div>
    </div>
    `;
      editor.addNode("start", 0, 1, pos_x, pos_y, "start", {}, start);
      break;
    case "slack":
      var slackchat = `
      <div>
        <div class="title-box" ><i class="fab fa-slack"></i> Message</div>
        <div class="setting-box">
          <i class="fa fa-cogs setting-icon" data-bs-toggle="modal" data-bs-target="#myModal">
        </div>
      </div>
      `;

      editor.addNode("slack", 1, 1, pos_x, pos_y, "slack", {}, slackchat);
      break;
    case "github":
      var githubtemplate = `
      <div>
        <div class="title-box" ><i class="fab fa-slack"></i> API</div>
        <div class="setting-box">
          <i class="fa fa-cogs setting-icon" data-bs-toggle="modal" data-bs-target="#apiModal">
        </div>
      </div>
      `;
      editor.addNode(
        "github",
        1,
        1,
        pos_x,
        pos_y,
        "github",
        { name: "" },
        githubtemplate
      );
      break;
    case "telegram":
      var telegrambot = `
      <div>
        <div class="title-box"><i class="fab fa-telegram-plane"></i> Telegram bot</div>
        <div class="box">
          <p>Send to telegram</p>
          <p>select channel</p>
          <select df-channel>
            <option value="channel_1">Channel 1</option>
            <option value="channel_2">Channel 2</option>
            <option value="channel_3">Channel 3</option>
            <option value="channel_4">Channel 4</option>
          </select>
        </div>
      </div>
      `;
      editor.addNode(
        "telegram",
        1,
        0,
        pos_x,
        pos_y,
        "telegram",
        { channel: "channel_3" },
        telegrambot
      );
      break;
    case "aws":
      var aws = `
      <div>
        <div class="title-box"><i class="fab fa-envelope"></i> Message</div>
      
      </div>
      `;
      editor.addNode(
        "aws",
        1,
        1,
        pos_x,
        pos_y,
        "aws",
        { db: { dbname: "", key: "" } },
        aws
      );
      break;
    case "log":
      var log = `
        <div>
          <div class="title-box"><i class="fas fa-file-signature"></i> Save log file </div>
        </div>
        `;
      editor.addNode("log", 1, 0, pos_x, pos_y, "log", {}, log);
      break;
    case "google":
      var google = `
        <div>
          <div class="title-box"><i class="fab fa-google-drive"></i> Google Drive save </div>
        </div>
        `;
      editor.addNode("google", 1, 0, pos_x, pos_y, "google", {}, google);
      break;
    case "email":
      var email = `
        <div>
          <div class="title-box"><i class="fas fa-at"></i> Send Email </div>
        </div>
        `;
      editor.addNode("email", 1, 0, pos_x, pos_y, "email", {}, email);
      break;

    case "template":
      var template = `
        <div>
          <div class="title-box"><i class="fas fa-code"></i> Template</div>
          <div class="box">
            Ger Vars
            <textarea df-template></textarea>
            Output template with vars
          </div>
        </div>
        `;
      editor.addNode(
        "template",
        1,
        1,
        pos_x,
        pos_y,
        "template",
        { template: "Write your template" },
        template
      );
      break;
    case "multiple":
      var multiple = `
        <div>
          <div class="box">
            Multiple!
          </div>
        </div>
        `;
      editor.addNode("multiple", 3, 4, pos_x, pos_y, "multiple", {}, multiple);
      break;
    case "personalized":
      var personalized = `
        <div>
          Personalized
        </div>
        `;
      editor.addNode(
        "personalized",
        1,
        1,
        pos_x,
        pos_y,
        "personalized",
        {},
        personalized
      );
      break;
    case "dbclick":
      var dbclick = `
        <div>
        <div class="title-box"><i class="fas fa-mouse"></i> Db Click</div>
          <div class="box dbclickbox" ondblclick="showpopup(event)">
            Db Click here
            <div class="modal" style="display:none">
              <div class="modal-content">
                <span class="close" onclick="closemodal(event)">&times;</span>
                Change your variable {name} !
                <input type="text" df-name>
              </div>

            </div>
          </div>
        </div>
        `;
      editor.addNode(
        "dbclick",
        1,
        1,
        pos_x,
        pos_y,
        "dbclick",
        { name: "" },
        dbclick
      );
      break;

    case "custom":
      var custom = `
        <div>
        <div class="title-box"><i class="fas fa-mouse"></i> Db Click</div>
          <div class="box dbclickbox" ondblclick="showpopup(event)">
            Db Click here
            <div class="modal" style="display:none">
              <div class="modal-content">
                <span class="close" onclick="closemodal(event)">&times;</span>
                Change your variable {name} !
                <input type="text" df-name>
              </div>

            </div>
          </div>
        </div>
        `;
      editor.addNode(
        "custom",
        1,
        1,
        pos_x,
        pos_y,
        "dbclick",
        { name: "" },
        custom
      );
      break;

    default:
  }
}

var transform = "";
function showpopup(e) {
  e.target.closest(".drawflow-node").style.zIndex = "9999";
  e.target.children[0].style.display = "block";
  //document.getElementById("modalfix").style.display = "block";

  //e.target.children[0].style.transform = 'translate('+translate.x+'px, '+translate.y+'px)';
  transform = editor.precanvas.style.transform;
  editor.precanvas.style.transform = "";
  editor.precanvas.style.left = editor.canvas_x + "px";
  editor.precanvas.style.top = editor.canvas_y + "px";
  console.log(transform);

  //e.target.children[0].style.top  =  -editor.canvas_y - editor.container.offsetTop +'px';
  //e.target.children[0].style.left  =  -editor.canvas_x  - editor.container.offsetLeft +'px';
  editor.editor_mode = "fixed";
}

function closemodal(e) {
  e.target.closest(".drawflow-node").style.zIndex = "2";
  e.target.parentElement.parentElement.style.display = "none";
  //document.getElementById("modalfix").style.display = "none";
  editor.precanvas.style.transform = transform;
  editor.precanvas.style.left = "0px";
  editor.precanvas.style.top = "0px";
  editor.editor_mode = "edit";
}

function changeModule(event) {
  var all = document.querySelectorAll(".menu ul li");
  for (var i = 0; i < all.length; i++) {
    all[i].classList.add("selected");
  }
  event.target.classList.add("selected");
}

function changeMode(option) {
  //console.log(lock.id);
  if (option == "lock") {
    lock.style.display = "none";
    unlock.style.display = "block";
  } else {
    lock.style.display = "block";
    unlock.style.display = "none";
  }
}

// append input fields

$(function () {
  $("#type").change(function () {
    if ($("#type").val() == "Text") {
      $(".dfield").hide();
      $("#message-field").show();
    } else if ($("#type").val() == "Image") {
      $(".dfield").hide();
      $("#url-field").show();
    } else if ($("#type").val() == "Video") {
      $(".dfield").hide();
      $("#url-field").show();
    } else if ($("#type").val() == "Audio") {
      $(".dfield").hide();
      $("#url-field").show();
    } else if ($("#type").val() == "Document") {
      $(".dfield").hide();
      $("#url-field").show();
    } else if ($("#type").val() == "Location") {
      $(".dfield").hide();
      $("#location-field").show();
    } else if ($("#type").val() == "Template") {
      $(".dfield").hide();
      $("#Template").show();
    }  else if ($("#type").val() == "Button") {
      $(".dfield").hide();
      $("#buttonFields").show();
    }else if ($("#type").val() == "ActionCard") {
     
      $(".dfield").hide();
      $("#Richcard").show();
    }
    
    else {
      $(".dfield").hide();
    }
  });
});




$(function () {
  $("#cardType").change(function () {
    if ($("#cardType").val() == "standalone") {
   
      $(".standaloneContainer").show();
      $(".CarouselContainer").hide();
     }else if ($("#cardType").val() == "carousel") {
      $(".standaloneContainer").hide();
      $(".CarouselContainer").show();
    } else {
      $(".standaloneContainer").hide();
    }
  });
});











$(function () {
  $("#response-type").change(function () {
    if ($("#response-type").val() == "User") {
      $(".refbox").hide();
      $("#Resp-user").show();
      $("#map-var").show();
      $("#fset").show();
      
    }else if ($("#response-type").val() == "System") {
      $(".refbox").hide();
      $("#Resp-user").show();
      $("#map-var").hide();
      $("#fset").show();
    }  else {
      $(".refbox").hide();
    }
  });
});


$(function () {
  $("#action-type").change(function () {
    if ($("#action-type").val() == "Continue") {
      $(".timeoutMessagerbox").hide();
      $("#timeoutMessager").hide();
     }else if ($("#action-type").val() == "Close") {
      $(".timeoutMessagerbox").show();
      $("#timeoutMessager").show();
    } else {
      $(".timeoutMessagerbox").hide();
    }
  });
});










$(document).ready(function () {
  $(".addCF").click(function () {
    $("#customFields").append(
      '<tr valign="top"><td><input type="text" class="code" id="customFieldName" name="customFieldName[]" value="" placeholder="Input Name" /></td><td> <input type="text" class="code" id="customFieldValue" name="customFieldValue[]" value="" placeholder="Input Value" /></td> <td> <a href="javascript:void(0);" class="remCF">Remove</a></td></tr>'
    );
  });
  $("#customFields").on("click", ".remCF", function () {
    $(this).parent().parent().remove();
  });
});





$(document).ready(function () {
  $(".addCF2").click(function () {
    $("#customFields2").append(
      '<tr valign="top"><td><input type="text" class="code" id="customFieldName" name="customFieldName[]" value="" placeholder="Input Name" /></td><td> <input type="text" class="code" id="customFieldValue" name="customFieldValue[]" value="" placeholder="Input Value" /></td> <td> <a href="javascript:void(0);" class="remCF">Remove</a></td></tr>'
    );
  });
  $("#customFields2").on("click", ".remCF", function () {
    $(this).parent().parent().remove();
  });
});

$(document).ready(function () {
  $(".addbtn").click(function () {
    $("#buttonFields").append(
      '<div class="button-block"><div class="mb-3 mt-3"><label for="label" class="form-label">Label</label><input type="text" class="form-control" id="label" placeholder="Please Enter Label" name="customFieldlabel"/></div><div class="mb-3 mt-3"><label for="id" class="form-label">ID</label><input type="text" class="form-control" id="id" placeholder="Enter Id" name="customFieldBtn"/></div><a href="javascript:void(0);" class="removebtn">Remove</a></div>'
    );
  });
  $("#buttonFields").on("click", ".removebtn", function () {
    $(this).parent().remove();
  });
});



$(document).ready(function () {
  $(".Saddbtn").click(function () {
    $("#RichcardButton").append(
      '<div class="button-block"><div class="mb-3 mt-3"><label for="label" class="form-label">Label</label><input type="text" class="form-control" id="label" placeholder="Please Enter Label" name="customFieldlabel"/></div><div class="mb-3 mt-3"><label for="label" class="form-label">Type</label><input type="text" class="form-control" id="typetext" placeholder="text" name="typetext"/></div><div class="mb-3 mt-3"><label for="id" class="form-label">ID</label><input type="text" class="form-control" id="id" placeholder="Enter Id" name="customFieldBtn"/></div><a href="javascript:void(0);" class="removebtn">Remove </a></div>'
    );
  });
  $("#RichcardButton").on("click", ".removebtn", function () {
    $(this).parent().remove();
  });
});



$(document).ready(function () {
  $(".addcard").click(function () {
    $("#cardbox").append(
      '<div class="c-card"><div class="mb-3 mt-3"><label for="url" class="form-label">Image Url</label><input type="text" class="form-control" id="Image url" placeholder="Please Enter Url" name="Image Url"/> </div><div class="mb-3 mt-3"> <label for="url" class="form-label">Title</label> <input type="text" class="form-control" id="s-title" placeholder="Please Enter Title" name="Image Url"/> </div><div class="mb-3 mt-3"> <label for="comment">Description:</label> <textarea class="form-control" rows="5" id="comment" placeholder="Please Enter Description" name="text"></textarea> </div><div class="mb-3 mt-3"> <label for="comment" class="mb-1 mt-1">Height</label> <select class="height form-select"> <option value="Short">Short</option> <option value="Medium">Medium</option> <option value="Tall">Tall</option> </select> </div><div class="template-part-box"> <label for="comment">Buttons</label> <a href="javascript:void(0);" class="carouselBtn">Add Button</a> </div><div class="row" id="carouseladdbtnBox"></div><a href="javascript:void(0);" class="removecard">Remove </a></div>'
    );
    $(".carouselBtn").click(function () {
      alert("hellow");
      $("#carouseladdbtnBox").append(
        '<div class="button-block"><div class="mb-3 mt-3"><label for="label" class="form-label">Label</label><input type="text" class="form-control" id="label" placeholder="Please Enter Label" name="customFieldlabel"/></div><div class="mb-3 mt-3"><label for="label" class="form-label">Type</label><input type="text" class="form-control" id="typetext" placeholder="text" name="typetext"/></div><div class="mb-3 mt-3"><label for="id" class="form-label">ID</label><input type="text" class="form-control" id="id" placeholder="Enter Id" name="customFieldBtn"/></div><a href="javascript:void(0);" class="removebtn">Remove </a></div>'
      );
    });
    $("#carouseladdbtnBox").on("click", ".removecard", function () {
      $(this).parent().parent().remove();
    });
  });
  $("#cardbox").on("click", ".removecard", function () {
    $(this).parent().remove();
  });
});



$(document).ready(function () {
  $("#enable-ref").click(function () {
    $(".red").toggle();
  });
});
