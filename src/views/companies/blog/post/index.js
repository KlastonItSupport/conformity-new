import React, { useContext, useEffect, useState } from "react";
import { NavBar } from "components/navbar";
import { Spinner, VStack } from "@chakra-ui/react";
import NavigationLinks from "components/navigationLinks";

import { compose } from "recompose";
import withAuthenticated from "hoc/with-authenticated";
import withWarningCheck from "hoc/with-warning-check";
import Card from "./components/card";
import { BlogContext } from "providers/blog";
import { useParams } from "react-router-dom";
import { sleep } from "helpers/sleep";

const BlogPostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getBlogPost } = useContext(BlogContext);

  const routeTreePaths = [
    {
      path: "/",
      label: "Dashboard",
    },

    {
      path: "/companies/blog-categories",
      label: "Categorias do Blog",
      isCurrent: true,
    },
  ];

  const onInit = async () => {
    // await dispatchAuditEvent(AUDIT_EVENTS.COMPANY_BLOG_LIST);
    setIsLoading(true);

    const post = await getBlogPost(id);
    setPost(post);

    await sleep(500);
    setIsLoading(false);
  };
  useEffect(() => {
    onInit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <NavBar />
      <VStack marginTop={"100px"} spacing={0} w="100%" h="100%">
        <NavigationLinks routeTree={routeTreePaths} />

        {isLoading ? (
          <Spinner mt={"20% !important"} color="#2B3D4C" size="xl" />
        ) : (
          post && <Card post={post} />
        )}
      </VStack>
    </>
  );
};

export default compose(
  withAuthenticated("companies"),
  withWarningCheck
)(BlogPostPage);
