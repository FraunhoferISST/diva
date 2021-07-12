export default (entity) => {
  let bgColor = "background-color: rgba(54, 89, 255, 1)";
  let shadowColor = "rgba(106, 117, 255, 0)";

  const bgColorMap = {
    resource: "#96c9f8",
    asset: "#4d4cac",
    user: "#ff808b",
  };
  bgColor = bgColorMap[entity.entityType] ?? "#f4f6fb";
  const title =
    entity.title ??
    entity.username ??
    "Probably this entity does not exists anymore";

  const cardStyle = `margin: 20px width: 200px; word-break: break-all; 
        overflow: hidden; border-radius: 8px; font-family: sans-serif; color: ${
          entity.title || entity.username ? "white" : "gray"
        }; height: 50px;
        font-size:1.15rem; position: relative; font-weight: ${
          entity.title || entity.username ? "bold" : "normal"
        }; box-shadow: 0 0 10px 5px ${shadowColor};
        padding: 16px; margin: 16px; background-color:${bgColor}`;

  const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="400" height="100">
          <rect x="0" y="0" width="100%" height="100%" fill="transparent" stroke-width="0" stroke="#ffffff" ></rect>
          <foreignObject x="0" y="0" width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml" style="">
            <div style="${cardStyle}">
               <div>
                    <span style="display:block">
                        ${
                          title.length > 55 ? title.slice(0, 55) + "..." : title
                        }
                    </span>
                </div>
            </div>
          </div>
          </foreignObject>
        </svg>`;

  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
};
