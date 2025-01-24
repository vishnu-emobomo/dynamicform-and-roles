import { useState, useEffect } from "react";

const CustomLogo = (hostAndPort) => {
  const [logoUrl, setLogoUrl] = useState("");
  const [urlPK, setUrlPK] = useState("");
  const [dynamicStyles, setDynamicStyles] = useState({ backgroundColor: "transparent" });
  const [titleName, setTitleName] = useState("");
  const [loading, setLoading] = useState(true);  // New loading state

  useEffect(() => {
    const storedData = sessionStorage.getItem("customLogoData");

    if (storedData) {
      const data = JSON.parse(storedData);
      setLogoUrl(data.logoUrl);
      setUrlPK(data.urlPK);
      setDynamicStyles(data.dynamicStyles);
      setTitleName(data.titleName);
      updateFavicon(data.logoUrl);
      updateTitle(data.titleName);
      setLoading(false);  // Stop loading when data is found
    } else {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `https://a9ut8qu643.execute-api.ap-south-1.amazonaws.com/api/data-from-url/${hostAndPort}`
          );

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();

          if (data.items && data.items.length > 0) {
            const logo = data.items[0].Logo || "";
            const pk = data.items[0].PK || "";
            const styles = data.items[0].style || { backgroundColor: "transparent" };
            const title = data.items[0].CompanyName || "";

            setLogoUrl(logo);
            setUrlPK(pk);
            setDynamicStyles(styles);
            setTitleName(title);

            console.log(styles ,": the data for dynamic")

            sessionStorage.setItem("customLogoData", JSON.stringify({
              logoUrl: logo,
              urlPK: pk,
              dynamicStyles: styles,
              titleName: title,
            }));

            updateFavicon(logo);
            updateTitle(title);
          }
        } catch (error) {
          console.error("Fetch error:", error);
        } finally {
          setLoading(false);  // Ensure loading stops even if fetch fails
        }
      };

      fetchData();
    }
  }, [hostAndPort]);

  const updateFavicon = (iconUrl) => {
    const link = document.querySelector("link[rel='icon']");
    if (link) {
      link.href = iconUrl;
    } else {
      const newLink = document.createElement("link");
      newLink.rel = "icon";
      newLink.href = iconUrl;
      document.head.appendChild(newLink);
    }
  };

  const updateTitle = (newTitle) => {
    document.title = newTitle;
  };

  return { logoUrl, urlPK, dynamicStyles, titleName, loading };
};

export default CustomLogo;