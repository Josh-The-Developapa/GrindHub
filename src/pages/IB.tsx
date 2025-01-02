import { useEffect } from "react";
import { Emoji } from "emoji-picker-react";
import { Box, Typography, Tooltip } from "@mui/material";
import { useResponsiveDisplay } from "../hooks/useResponsiveDisplay";
import { EmojiStyle } from "emoji-picker-react";
import { useNavigate } from "react-router-dom";
import { GreetingHeader, GreetingText} from '../styles'

const Home = () => {
  const isMobile = useResponsiveDisplay();
  const n = useNavigate();
  const emojiStyle: EmojiStyle = EmojiStyle.NATIVE;

  useEffect(() => {
    document.title = "IB Resources Hub";
  }, []);

  const resources = [
    {
      name: "Save My Exams",
      url: "https://www.savemyexams.com/",
      description: "Good notes for all-round subjects including sciences, math, and business.",
    },
    {
      name: "Kognity",
      url: "https://kognity.com/",
      description: "Very good for Physics, offering comprehensive notes for all topics.",
    },
    {
      name: "ThinkIB",
      url: "https://www.thinkib.net",
      description: "Excellent for Business, Economics, and French notes.",
    },
    {
      name: "Revision Village",
      url: "https://www.revisionvillage.com",
      description: "Best resources for Math and sciences.",
    },
    {
      name: "IBDocs",
      url: "https://dl.ibdocs.re",
      description: "Access past papers and question banks for all subjects.",
    },
    {
      name: "SaveMyExams Archive",
      url: "https://smearchive.pages.dev/",
      description: "A free archive of SaveMyExams, a great resource for revision and practice questions.",
    },
    {
      name: "PirateIB Notes Compilation",
      url: "https://pirateib.xyz/ibnotes/",
      description: "A massive collection of notes for various IB subjects, perfect for quick reference.",
    },
    {
      name: "IB Academy Study Guides",
      url: "https://ib-academy.nl/free-resources",
      description: "Free study guides for a variety of subjects, offering detailed and easy-to-understand content.",
    },
    {
      name: "Christos Nikolaidis’s Notes",
      url: "https://www.christosnikolaidis.com/en/",
      description: "The holy grail for Mathematics in the IBDP (HL & SL), perfect for deepening your understanding.",
    },
    {
      name: "EconplusDal",
      url: "https://www.econplusdal.com/",
      description: "Economics notes and resources designed to help you ace your exams, tailored to the IB syllabus.",
    },
    {
      name: "EcoNinja",
      url: "https://www.econinja.net/",
      description: "Free notes, diagrams, and definitions for the new IB Economics syllabus, with an easy-to-follow format.",
    },
    {
      name: "Business Management and Economics Notes",
      url: "https://ibnotes42teocgiralgo.notion.site/",
      description: "An amazing set of notes specifically for Business Management and Economics.",
    },
    {
      name: "Computer Science Café",
      url: "https://www.computersciencecafe.com/ib.html",
      description: "Comprehensive Computer Science notes and resources for IB students.",
    },
    {
      name: "Spanish Ab",
      url: "https://spanishab.com/",
      description: "Comprehensive notes for Spanish Ab Initio, perfect for students looking to excel in the language.",
    },
    {
      name: "Nikles’s Chemistry Revision Videos",
      url: "https://www.youtube.com/@nikleschemistry/playlists",
      description: "Chemistry revision videos covering the 2023-2025 syllabus, perfect for visual learners.",
    },
    {
      name: "OSC Revision Videos",
      url: "https://www.youtube.com/@OSC1990/playlists",
      description: "Physics and Biology revision videos tailored to the 2023-2025 syllabus.",
    },
  ];

  return (
    <>
      <Typography variant="h4" gutterBottom>
              {/* <Emoji unified="1f44b" emojiStyle={emojiStyle} /> IB Resources Hub */}
              <GreetingHeader>
                  <Emoji unified="1f44b" emojiStyle={emojiStyle} /> &nbsp;&nbsp;IB Resources &nbsp;</GreetingHeader>
            
      </Typography>
          {/* <Typography variant="body1" paragraph> */}
              <GreetingText> Explore these amazing resources to aid your IB studies. Click on any link to get started:</GreetingText>
       <br/>
      {/* </Typography> */}
      <Box display="flex" flexDirection="column" gap={2}>
        {resources.map((resource, index) => (
          <Box
            key={index}
            sx={{
              padding: "12px",
              backgroundColor: "#2e2e2e", // Dark mode background
              borderRadius: "8px",
              border: "1px solid #444", // Darker border for dark mode
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Typography variant="h6" color="primary">
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: "none",
                  color: "#64b5f6", // Lighter blue for text links
                  fontWeight: "bold",
                }}
              >
                {resource.name}
              </a>
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {resource.description}
            </Typography>
            <Box sx={{ marginTop: "12px" }}>
              <iframe
                src={resource.url}
                width="100%"
                height="200px"
                title={resource.name}
                style={{ borderRadius: "8px" }}
              />
            </Box>
          </Box>
        ))}
      </Box>
      {!isMobile && (
        <Tooltip title="Return to Dashboard" placement="left">
          <Box
            sx={{
              position: "fixed",
              bottom: "16px",
              right: "16px",
              backgroundColor: "#1976d2",
              borderRadius: "50%",
              width: "56px",
              height: "56px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            onClick={() => n("/dashboard")}
          >
            <Typography variant="button" color="white">
              Back
            </Typography>
          </Box>
        </Tooltip>
      )}
    </>
  );
};

export default Home;
