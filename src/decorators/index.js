import { CompositeDecorator } from "draft-js";
import { findEntities } from "../helpers/entity";
import Link from "../components/Link";
import Comment from "../components/Comment";

const decorator = ({ clickComment, clickLink }) =>
  new CompositeDecorator([
    {
      strategy: (contentBlock, callback, contentState) => {
        return findEntities("LINK", contentBlock, callback, contentState);
      },
      component: Link,
      props: { clickLink }
    },
    {
      strategy: (contentBlock, callback, contentState) => {
        return findEntities("COMMENT", contentBlock, callback, contentState);
      },
      component: Comment,
      props: { clickComment }
    }
  ]);

export default decorator;
