import { useState, useEffect } from "react"
import { TinaMarkdown } from "tinacms/dist/rich-text"

export default function CustomTabsPage({ lists }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [previewImage, setPreviewImage] = useState(null)
  console.log(previewImage);

  if (!lists || lists.length === 0) return null

  useEffect(() => {
    setActiveIndex(0)
  }, [lists])

  return (
    <div>
      {/* Tabs */}
      <div style={styles.tabs}>
        {lists.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            style={{
              ...styles.tab,
              ...(activeIndex === index ? styles.activeTab : {}),
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Content */}
      <div style={styles.content}>
        {/* <h3 style={styles.title}>
          {lists[activeIndex]?.label}
        </h3> */}

        <TinaMarkdown
          content={lists[activeIndex]?.children}
          components={{
            url: (props) => (
              <img
                {...props}
                style={styles.image}
                onClick={() => setPreviewImage(props?.url)}
              />
            ),
          }}
        />
      </div>

      {/* Image Modal */}
      {previewImage && (
        <div
          style={styles.overlay}
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            style={styles.modalImage}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}

const styles = {
  tabs: {
    display: "flex",
    gap: "5px",
    borderBottom: "2px solid #F8FFF8",
  },
  tab: {
    background: "#F8FFF8",
    border: "none",
    padding: "10px",
    cursor: "pointer",
    borderBottom: "2px solid transparent",
    fontSize: "15px",
    borderRadius: "5px 5px 0 0",
    transition: "all 0.2s ease",
  },
  activeTab: {
    borderBottom: "2px solid #577399",
    fontWeight: "bold",
    backgroundColor: "#eff3f6",
    color: "#2A2A2A",
  },
  content: {
    padding: "15px",
    backgroundColor: "#eff3f6",
    borderRadius: "0  15px 15px 15px",
    marginBottom: "50px",
  },
  title: {
    paddingTop: "10px",
    marginBottom: "20px",
    color: "#577399",
  },
  image: {
    maxWidth: "100%",
    cursor: "pointer",
    borderRadius: "6px",
    transition: "transform 0.2s ease",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modalImage: {
    maxWidth: "90%",
    maxHeight: "90%",
    borderRadius: "8px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
  },
}
