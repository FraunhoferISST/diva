/*
//Entity common views
import EntityGeneral from "@/components/Entity/EntityCommonComponents/General/EntityGeneral";
import EntityDetails from "@/views/EntityDetails";
import EntityHistory from "@/components/Entity/EntityCommonComponents/History/EntityHistory";
import EntityReviews from "@/components/Entity/EntityCommonComponents/Reviews/EntityReviews";

const entityCommonRoutes = (prefix) => [
  {
    path: "history",
    name: `${prefix}_details_history`,
    component: EntityHistory,
    props: true,
  },
  {
    path: "reviews",
    name: `${prefix}_details_reviews`,
    component: EntityReviews,
    props: true,
  },
];

const entityRoutesFactory = (
  prefix = "entity",
  startView = EntityDetails,
  generalView = EntityGeneral
) => {
  return {
    path: `entities/:id`,
    name: "entities",
    component: startView,
    props: (route) => ({
      id: route.params.id,
      links: [
        {
          title: "Overview",
          icon: "short_text",
          name: "resource_details_general",
        },
        {
          title: "Costs",
          icon: "attach_money",
          name: "resource_details_costs",
        },
        {
          title: "Profiling",
          icon: "developer_board",
          name: "resource_details_profiling",
        },
        {
          title: "Sample",
          icon: "description",
          name: "resource_details_sample",
        },
        {
          title: "History",
          icon: "history",
          name: "resource_details_history",
        },
        {
          title: "Reviews",
          icon: "question_answer",
          name: "resource_details_reviews",
        },
      ],
    }),
    redirect: {
      name: `${prefix}_details_general`,
    },
    children: [
      {
        path: "general",
        name: `${prefix}_details_general`,
        component: generalView,
        props: true,
      },
      ...entityCommonRoutes(prefix),
    ],
  };
};

const systemEntityConfig = entityRoutesFactory();

export default [];
*/
