// Interfaces
import { Post } from "interfaces/posts";

// Utils
import { sortById } from "pages";

// Hooks
import { useEffect, useState } from "react";

// Components
import Image from "next/image";

// Styles
import customStyles from "styles/custom.module.css";

// Types
type CurrentPost = {
  id?: number;
  title: string;
  description: string;
  edit: boolean;
};

type OnClickPost = (type: string, post?: Post) => void;


// Helper
const renderAllPosts = (
  posts: Post[],
  onClickPost: OnClickPost,
  currentPost?: Partial<CurrentPost>
) => {
  return (
    <div className={`w3-card w3-margin w3-container ${customStyles.column}`}>
      <div className="w3-container w3-padding">
        <h4 className=" w3-left">Popular Posts</h4>
        {currentPost?.id && (
          <button
            className="w3-button w3-green w3-border w3-right"
            onClick={() => onClickPost("add")}
          >
            <b>Add New Post</b>
          </button>
        )}
      </div>
      <ul className={`w3-ul w3-white ${customStyles.postUl}`} >
        {posts.map((post: Post, index: number) => (
          <li
            className="w3-padding-16 w3-hide-medium w3-hide-small"
            key={`${index}-post-card`}
          >
            <Image
              src="/img/rock.jpg"
              alt="rock"
              className="w3-left w3-margin-right"
              width={50}
              height={50}
            />
            <span className="w3-large">
              {/* used slice to make it short just for visualization purpose */}
              <b>{post.title.slice(0, 25)}</b>
            </span>
            <br />
            <div className={customStyles.postDescription}>
              {post.description}
            </div>

            <button
              className={`w3-button w3-padding w3-blue w3-border w3-right ${customStyles.btnView}`}
              onClick={() => onClickPost("view", post)}
            >
              <b>View</b>
            </button>

            <button
              className={`w3-button w3-padding w3-red w3-border w3-right ${customStyles.btnDelete}`}
              onClick={() => onClickPost("delete", post)}
            >
              <b>Delete</b>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Helper
const renderForm = (
  onChangeValue: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  onSubmitForm: React.FormEventHandler<HTMLFormElement>,
  currentPost?: Partial<CurrentPost>
) => {
  return (
    <div className={`container ${customStyles.column}`}>
      <form onSubmit={onSubmitForm}>
        <div className={`row ${customStyles.titleWrapper}`} >
          <div className="col-25">
            <label htmlFor="post_title">Title</label>
          </div>
          <div className="col-75">
            <input
              type="text"
              id="post_title"
              name="title"
              placeholder="Post title"
              className={customStyles.titleInput}
              value={currentPost?.title || ""}
              onChange={onChangeValue}
            />
          </div>
        </div>
        <div className={`row ${customStyles.descriptionWrapper}`}>
          <div className="col-25">
            <label htmlFor="post_description">Descripiton</label>
          </div>
          <div className="col-75">
            <textarea
              id="post_description"
              name="description"
              placeholder="description"
              value={currentPost?.description || ""}
              onChange={onChangeValue}
              className={customStyles.descriptionInput}
            ></textarea>
          </div>
        </div>
        <div className="row">
          <input
            disabled={currentPost?.description?.length === 0 || currentPost?.title?.length === 0}
            type="submit"
            value="Save"
            className="w3-button w3-padding-large w3-green w3-border"
          />
        </div>
      </form>
    </div>
  );
};

// Helper
const renderSinglePost = (
  currentPost: Partial<CurrentPost>,
  onClickPost: (type: string, post: Partial<CurrentPost>) => void
) => {
  return (
    <div
      className={`w3-card-4 w3-margin w3-white w3-container ${customStyles.column}`}
    >
      <Image
        src="/img/woods.jpg"
        alt="Nature"
        width={900}
        height={200}
      />
      <div className="w3-container">
        <h4 className="w3-opacity">{currentPost?.title}</h4>
        <hr />
      </div>

      <div className="w3-container">
        <p>{currentPost?.description}</p>
        <div className="w3-row">
          <div className="w3-col m1 w3-hide-small w3-right">
            <button
              className={`w3-button w3-padding-large w3-white w3-border ${customStyles.btnEdit}`}
              onClick={() =>
                onClickPost("edit", { ...currentPost, edit: true })
              }
            >
              <b>Edit</b>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Initial state
const currentPostInitialState = {
  title: "",
  description: "",
  edit: false,
}

// Element
const Posts = ({ posts }: { posts: Post[] }): JSX.Element => {
  const [allPost, setAllPost] = useState<Post[] | undefined>();
  const [currentPost, setCurrentPost] = useState<Partial<CurrentPost> | undefined>({...currentPostInitialState});

  useEffect(() => {
    setAllPost(posts);
  }, [posts]);

  const onClickPost = async (type: string, post?: Post | Partial<CurrentPost>) => {
    if (type === "add") {
      setCurrentPost({ title: "", description: "", edit: false });
    }
    if (type === "delete" && post?.id) {
      await fetch(`http://localhost:3000/api/posts/${post.id}`, {
        method: "DELETE",
        headers: { "Content-type": "application/json; charset=UTF-8", Accept: 'application.json' },
      }).then((res) => {
        if (res.status === 202) {
          res.json().then((data) => {
            setAllPost(sortById(data));
            setCurrentPost({...currentPostInitialState})
          });
        }
      });
    }
    if (type === "view" && post?.id) {
      setCurrentPost({ ...post, edit: false });
    }

    if (type === "edit" && post?.id) {
      setCurrentPost({ ...post, edit: true });
    }
  };

  const onChangeValue = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCurrentPost({ ...currentPost, [event.target.name]: event.target.value });
  };

  const onSubmitForm = async (event: React.FormEvent) => {
    event.preventDefault();
    const url = "http://localhost:3000/api/posts";
    await fetch(currentPost?.id ? `${url}/${currentPost.id}` : url, {
        method: currentPost?.id ? "PUT" : "POST",
        headers: { "Content-type": "application/json; charset=UTF-8", Accept: 'application.json', },
        body: JSON.stringify({title: currentPost?.title, description: currentPost?.description})
      }).then((response) => response.json())
      .then((data) => {
        setAllPost(sortById(data));
        setCurrentPost({...currentPostInitialState})
      })
      .catch((error) => {
        // dirty, should be notification.
        console.error('Error:', error);
      });
  };

  return (
      <div className={`w3-container ${customStyles.wrapper}`}>
        <div className={customStyles.row}>

          {allPost && renderAllPosts(allPost, onClickPost, currentPost)}

          {!currentPost?.edit &&
            currentPost?.id &&
            renderSinglePost(currentPost, onClickPost)}

          {((!currentPost?.edit && !currentPost?.id) ||
            (currentPost?.edit && currentPost?.id)) &&
            renderForm(onChangeValue, onSubmitForm, currentPost)}

        </div>
      </div>
  );
}

// Export
export default Posts;
