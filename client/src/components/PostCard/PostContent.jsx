import * as s from "./PostCard.styles";
const PostContent = ({
  title,
  content,
  mediaUrl,
  mediaType,
  getImageUrl,
  onNavigate,
}) => (
  <div onClick={onNavigate} style={{ cursor: "pointer" }}>
    <div style={{ padding: "0 15px 15px 15px", textAlign: "right" }}>
      {title && (
        <h3 style={{ margin: "0 0 10px 0", fontSize: "1.2rem" }}>{title}</h3>
      )}
      <p style={s.contentTextStyle}>{content}</p>
    </div>
    {mediaUrl && (
      <div style={s.mediaWrapperStyle}>
        {mediaType === "video" ? (
          <video
            src={getImageUrl(mediaUrl)}
            controls
            style={s.mediaContentStyle}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <img src={getImageUrl(mediaUrl)} style={s.mediaContentStyle} alt="" />
        )}
      </div>
    )}
  </div>
);
export default PostContent;
