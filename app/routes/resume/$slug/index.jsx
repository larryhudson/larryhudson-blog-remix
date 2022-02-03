import { DocumentRenderer } from "@keystone-6/document-renderer";
import { json, useLoaderData, Link } from "remix";
import Dump from "~/components/Dump";
import { fetchQuery } from "~/utils/graphql.server";
import resumeStyles from "~/styles/resume.css";
import printStyles from "~/styles/print.css";
import { isoToMonthYear } from "~/utils/date";

export const loader = async ({ params }) => {
  const resumeData = await fetchQuery({
    query: `query ResumeQuery($slug: String) {
      resume(where: { slug: $slug }) {
        title
        aboutMe {
          document
        }
        relevantProjects {
          title
          date
          blurb {
            document
          }
          softwareTools {
            title
          }
        }
        references {
          name
          position
          phone
        }
      }
      experienceCompanies {
        id
        name
        description
        website
        positions(orderBy: { dateEnd: desc }) {
          title
          blurb {
            document
          }
          dateStart
          dateEnd
        }
      }
    }
    `,
    variables: {
      slug: params.slug,
    },
  });

  return json(resumeData);
};

export const links = () => [
  {
    rel: "preconnect",
    href: "https://fonts.googleapis.com",
  },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap",
  },
  {
    rel: "stylesheet",
    media: "print",
    href: printStyles,
  },
  {
    rel: "stylesheet",
    href: resumeStyles,
  },
];

export default function ResumePage() {
  const resumeData = useLoaderData();
  return (
    <div>
      <header className="inverse">
        <img
          src="https://www.informationaccessgroup.com/images/our_team/Larry_2020.jpg"
          alt=""
          className="float-left larry-image"
        />
        <div>
          <h1>Larry Hudson</h1>
          <DocumentRenderer document={resumeData.resume.aboutMe.document} />
        </div>
      </header>
      <div class="page-container">
        <div className="columns-2">
          <div>
            <h2>Experience</h2>
            {resumeData.experienceCompanies.map((company) => (
              <div key={company.id}>
                <h3>
                  <a href={company.website}>{company.name}</a>
                </h3>
                <p>{company.description}</p>
                {company.positions.map((position) => (
                  <div>
                    <h4>{position.title}</h4>
                    {position.dateEnd ? (
                      <p>
                        {isoToMonthYear(position.dateStart)} to{" "}
                        {isoToMonthYear(position.dateEnd)}
                      </p>
                    ) : (
                      <p>{isoToMonthYear(position.dateStart)} to now</p>
                    )}
                    <DocumentRenderer document={position.blurb.document} />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div>
            <h2>Projects</h2>
            {resumeData.resume.relevantProjects.map((project) => (
              <div className="card">
                <h3>{project.title}</h3>
                <p>{isoToMonthYear(project.date)}</p>
                <p>
                  {project.softwareTools.map((s) => (
                    <Link className="pill" to={`/software-tool/`}>
                      {s.title}
                    </Link>
                  ))}
                </p>
                {/* <DocumentRenderer document={project.blurb.document} /> */}
              </div>
            ))}
          </div>
        </div>

        <h2>References</h2>
        {resumeData.resume.references.map((referee) => (
          <div>
            <h3>{referee.name}</h3>
            <p>{referee.position}</p>
            <p>Phone: {referee.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
