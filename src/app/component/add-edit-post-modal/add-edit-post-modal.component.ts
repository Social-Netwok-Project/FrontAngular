import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {faCheck, faCross, faTrash, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {ModalComponent} from "../misc/modal-component";
import {ModalOpenType} from "../misc/modal-open-type";
import {CurrentMemberService} from "../../service/current-member.service";
import {generateRandomString, getCurrentDate} from "../misc/functions";
import {Post} from "../../model/post";
import {PostImage} from "../../model/post-image";
import {PostService} from "../../service/post.service";
import {PostVideoService} from "../../service/post-video.service";
import {PostImageService} from "../../service/post-image.service";
import {UploadStatus} from "../misc/form-component";
import {PostVideo} from "../../model/post-video";
import {TagService} from "../../service/tag.service";
import {Tag} from "../../model/tag";
import {TagPerPost} from "../../model/tag-per-post";
import {TagPerPostService} from "../../service/tag-per-post.service";

@Component({
  selector: 'app-add-edit-tweet-modal',
  standalone: true,
  imports: [
    FaIconComponent,
    NgIf,
    FormsModule,
    NgForOf
  ],
  templateUrl: './add-edit-post-modal.component.html',
  styleUrl: './add-edit-post-modal.component.scss'
})
export class AddEditPostModalComponent extends ModalComponent implements OnInit {
  @Input() override isModalOpen = false
  @Output() override onModalChangeEmitter = new EventEmitter<boolean>();

  private readonly maxSize: number = 100000000;
  private readonly maxImages: number = 4;
  private readonly maxVideos: number = 2;

  faXmark = faXmark;
  faCheck = faCheck;

  images: File[] = [];
  videos: File[] = [];
  availableTags: Tag[] = [];
  selectedTagId!: string;

  imagesStatusMsg: string = "";
  videosStatusMsg: string = "";

  postImagesIdsToDelete: number[] = [];
  postVideosIdsToDelete: number[] = [];
  tagsIdsToDelete: number[] = [];

  isImagesSuccess: boolean = false;
  isVideosSuccess: boolean = false;

  isPostAdded: boolean = false;

  faTrash = faTrash;

  @Input() modalOpenType: ModalOpenType = ModalOpenType.NONE;
  @Input() editingPost!: Post;

  @ViewChild("videoInput") videoInput!: ElementRef;
  @ViewChild("imageInput") imageInput!: ElementRef;

  constructor(protected override postService: PostService,
              protected override postImageService: PostImageService,
              protected override postVideoService: PostVideoService,
              protected override currentMemberService: CurrentMemberService,
              protected override tagService: TagService,
              protected override tagPerPostService: TagPerPostService,
              protected override router: Router, protected override route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.tagService.getAllEntities().subscribe({
      next: (jsonTags: Tag[]) => {
        this.availableTags = Tag.initializeTags(jsonTags);
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      }
    });
  }

  override isFormValid(): boolean {
    let checkedFileTypes: boolean = true;

    for (let i = 0; i < this.images.length; i++) {

      checkedFileTypes = this.images[i].type == 'image/png' || this.images[i].type == 'image/jpeg';
      if (!checkedFileTypes) break;
    }

    return this.editingPost.title.length > 0 && this.editingPost.body.length > 0 && checkedFileTypes
  }

  getFilesSize(files: File[]): number {
    let size = 0;

    for (let i = 0; i < files.length; i++) {
      size += files[i].size;
    }

    console.log(size)
    return size;
  }

  onImageSelected(event: any) {
    if ((this.images.length + event.target.files.length) > this.maxImages) {
      this.imagesStatusMsg = `You can only upload ${this.maxImages} images!`;
    } else if (this.getFilesSize(this.images) + this.getFilesSize(event.target.files) > this.maxSize) {
      this.imagesStatusMsg = `Image size is too big! Max is 100MB`;
    } else {
      for (let i = 0; i < event.target.files.length; i++) {
        this.images.push(event.target.files[i]);
        let name = `${generateRandomString(10)}-${i}-${this.images[i].name}`

        let postImage = new PostImage(name, this.images[i].name, this.editingPost.postId!);
        postImage.imageUrl = URL.createObjectURL(event.target.files[i]);

        this.editingPost.postImageList.push(postImage);
      }
    }

    this.imageInput.nativeElement.value = "";
  }

  onVideoSelected(event: any) {
    if (this.videos.length + event.target.files.length > this.maxVideos) {
      this.videosStatusMsg = `You can only upload ${this.maxVideos} videos!`;
    } else if (this.getFilesSize(this.videos) + this.getFilesSize(event.target.files) > this.maxSize) {
      this.videosStatusMsg = `Video size is too big! Max is 100MB`;
    } else {
      for (let i = 0; i < event.target.files.length; i++) {
        console.log(event.target.files[i])

        this.videos.push(event.target.files[i]);
        let name = `${generateRandomString(10)}-${i}-${this.videos[i].name}`

        let postVideo = new PostVideo(name, this.videos[i].name, this.videos[i].size, this.videos[i].size, this.editingPost.postId!);
        postVideo.videoUrl = URL.createObjectURL(event.target.files[i]);

        this.editingPost.postVideoList.push(postVideo);
      }
    }

    this.videoInput.nativeElement.value = "";
  }

  onTagSelected() {
    let selectedTagId = parseInt(this.selectedTagId);
    if(!this.editingPost.tagPerPostList.find(tagPerPost => tagPerPost.tagId == selectedTagId) && this.selectedTagId != undefined) {
      let tagPerPost = new TagPerPost(this.editingPost.postId!, selectedTagId);
      this.editingPost.tagPerPostList.push(tagPerPost);
    }
  }

  getSelectedTags() {
    return this.availableTags.filter(tag => {
      return this.editingPost.tagPerPostList.find(tagPerPost => tag.tagId == tagPerPost.tagId) != undefined;
    })
  }

  onAcceptClick() {
    if (!this.isFormValid()) {
      this.imagesStatusMsg = "Invalid form data!";
      return;
    }

    if (this.modalOpenType == ModalOpenType.ADD) {
      let postImagesToAdd = this.editingPost.postImageList
      let postVideosToAdd = this.editingPost.postVideoList
      let tagPerPostListToAdd = this.editingPost.tagPerPostList

      this.editingPost.postImageList = [];
      this.editingPost.postVideoList = [];
      this.editingPost.tagPerPostList = [];

      this.editingPost.creationDate = getCurrentDate();

      let successCount = 0;
      new Observable<boolean>(observer => {
        this.postService.addEntity(this.editingPost).subscribe({
          next: (jsonPost: Post) => {
            let post = Post.fromJson(jsonPost);
            this.editingPost.postId = post.postId;

            new Observable<number>((observer) => {
              let count = 1;
              if (postImagesToAdd.length == 0) observer.next(0);

              postImagesToAdd.forEach((postImage: PostImage) => {
                postImage.postId = post.postId!;
                this.postImageService.addEntity(postImage).subscribe({
                  next: (jsonPostImage: PostImage) => {
                    let postImage = PostImage.fromJson(jsonPostImage);
                    console.log("Added post image with id: " + postImage.postImageId);
                    post.postImageList.push(postImage);
                    observer.next(count++);
                  },
                  error: (error: HttpErrorResponse) => {
                    observer.error(error);
                    console.error(error);
                  }
                });
              });
            }).subscribe({
              next: (count: number) => {
                if (count === postImagesToAdd.length) {
                  console.log("Added all post images")
                  this.editingPost.postImageList = postImagesToAdd;
                  this.uploadPostImages(post).then((isSuccess: boolean) => {
                    this.isImagesSuccess = isSuccess;
                    observer.next(isSuccess);
                  });
                }
              },
              error: (error: HttpErrorResponse) => {
                console.error(error);
                observer.next(false);
              }
            });

            new Observable<number>((observer) => {
              let count = 1;
              if (postVideosToAdd.length == 0) observer.next(0);

              postVideosToAdd.forEach((postVideo: PostVideo) => {
                postVideo.postId = post.postId!;
                this.postVideoService.addEntity(postVideo).subscribe({
                  next: (jsonPostVideo: PostVideo) => {
                    let postVideo = PostVideo.fromJson(jsonPostVideo);
                    console.log("Added post video with id: " + postVideo.postVideoId);
                    post.postVideoList.push(postVideo);
                    observer.next(count++);
                  },
                  error: (error: HttpErrorResponse) => {
                    observer.error(error);
                    console.error(error);
                  }
                });
              });
            }).subscribe({
              next: (count: number) => {
                if (count === postVideosToAdd.length) {
                  console.log("Added all post videos")
                  this.editingPost.postVideoList = postVideosToAdd;
                  this.uploadPostVideos(post).then((isSuccess: boolean) => {
                    this.isVideosSuccess = isSuccess;
                    observer.next(isSuccess);
                  });
                }
              },
              error: (error: HttpErrorResponse) => {
                console.error(error);
                observer.next(false);
              }
            });

            new Observable<number>((observer) => {
              let count = 1;
              if (tagPerPostListToAdd.length == 0) observer.next(0);

              tagPerPostListToAdd.forEach((tagPerPost: TagPerPost) => {
                tagPerPost.postId = post.postId!;
                this.tagPerPostService.addEntity(tagPerPost).subscribe({
                  next: (jsonTagPerPost: TagPerPost) => {
                    let tagPerPost = TagPerPost.fromJson(jsonTagPerPost);
                    console.log("Added tag per post with id: " + tagPerPost.tagPerPostId);
                    observer.next(count++);
                  },
                  error: (error: HttpErrorResponse) => {
                    observer.error(error);
                    console.error(error);
                  }
                });
              });
            }).subscribe({
              next: (count: number) => {
                if (count === tagPerPostListToAdd.length) {
                  console.log("Added all tag per posts")
                  this.editingPost.tagPerPostList = tagPerPostListToAdd;
                  observer.next(true);
                }
              },
              error: (error: HttpErrorResponse) => {
                console.error(error);
                observer.next(false);
              }
            });
          },
          error: (error: HttpErrorResponse) => {
            console.error(error);
            observer.next(false);
          }
        });
      }).subscribe({
        next: (isSuccess: boolean) => {
          if (isSuccess) {
            successCount++;
            if (successCount == 3) {
              this.currentMemberService.member?.posts.push(this.editingPost);
              this.resetValues();
              this.isPostAdded = true;
            }
          }
        }
      });
    } else if (this.modalOpenType == ModalOpenType.EDIT) {
      this.postService.updateEntity(this.editingPost).subscribe({
        next: (post: Post) => {
          this.uploadPostImages(Post.fromJson(post)).then();
          this.uploadPostVideos(Post.fromJson(post)).then();
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
        }
      });

      this.postImagesIdsToDelete.forEach((postImageId: number) => {
        this.postImageService.deleteEntityById(postImageId).subscribe({
          next: () => {
            console.log("Deleted post image with id: " + postImageId);
            let postImageToRemove = this.editingPost.postImageList
              .find((postImage: PostImage) => postImage.postImageId === postImageId);

            this.editingPost.postImageList.splice(this.editingPost.postImageList.indexOf(postImageToRemove!), 1)

            this.postImageService.deleteFile(postImageToRemove!.name).subscribe({
              next: () => {
                console.log("Deleted post image file with path: " + postImageToRemove!.name);
              },
              error: (error: HttpErrorResponse) => {
                console.error(error);
              }
            });
          },
          error: (error: HttpErrorResponse) => {
            console.error(error);
          }
        });
      });
      this.postVideosIdsToDelete.forEach((postVideoId: number) => {
        this.postVideoService.deleteEntityById(postVideoId).subscribe({
          next: () => {
            console.log("Deleted post video with id: " + postVideoId);
            let postVideoToRemove = this.editingPost.postVideoList
              .find((postVideo: PostVideo) => postVideo.postVideoId === postVideoId);

            this.editingPost.postVideoList.splice(this.editingPost.postVideoList.indexOf(postVideoToRemove!), 1)

            this.postVideoService.deleteFile(postVideoToRemove!.name).subscribe({
              next: () => {
                console.log("Deleted post video file with path: " + postVideoToRemove!.name);
              },
              error: (error: HttpErrorResponse) => {
                console.error(error);
              }
            });
          },
          error: (error: HttpErrorResponse) => {
            console.error(error);
          }
        });
      });
    }
  }

  uploadPostImages(post: Post) {
    return new Promise<boolean>((resolve, reject) => {
      let formData = new FormData();

      for (let i = 0; i < this.images.length; i++) {
        let currentPostImage = this.editingPost.postImageList
          .find((postImage: PostImage) => postImage.fileName === this.images[i].name)!;

        let newPostImage = post.postImageList
          .find((postImage: PostImage) => postImage.name === currentPostImage.name)!;

        currentPostImage.postImageId = newPostImage.postImageId;

        formData.append('files', this.images[i], currentPostImage.name);
      }

      if (this.images.length > 0) {
        this.uploadFiles(this.postImageService, formData).subscribe({
          next: (uploadStatus: UploadStatus) => {
            this.imagesStatusMsg = uploadStatus.statusMsg;
            if (uploadStatus.isSuccessful && uploadStatus.isDone) {
              console.log("Successfully uploaded post images")
              resolve(true);
            } else if (!uploadStatus.isSuccessful && uploadStatus.isDone) {
              console.log("Failed to upload post images")
              resolve(false);
            }
          },
          error: (error: HttpErrorResponse) => {
            resolve(false)
            console.error(error);
          }
        });
      } else {
        resolve(true);
      }
    })
  }

  uploadPostVideos(post: Post) {
    return new Promise<boolean>((resolve, reject) => {
      let formData = new FormData();

      for (let i = 0; i < this.videos.length; i++) {
        let currentPostVideo = this.editingPost.postVideoList
          .find((postVideo: PostVideo) => postVideo.fileName === this.videos[i].name)!;

        let newPostVideo = post.postVideoList
          .find((postVideo: PostVideo) => postVideo.name === currentPostVideo.name)!;

        currentPostVideo.postVideoId = newPostVideo.postVideoId;

        formData.append('files', this.videos[i], currentPostVideo.name);
      }

      if (this.videos.length > 0) {
        this.uploadFiles(this.postVideoService, formData).subscribe({
          next: (uploadStatus: UploadStatus) => {
            this.videosStatusMsg = uploadStatus.statusMsg;
            if (uploadStatus.isSuccessful && uploadStatus.isDone) {
              resolve(true);
              console.log("Successfully uploaded post videos")
            } else if (!uploadStatus.isSuccessful && uploadStatus.isDone) {
              resolve(false);
              console.log("Failed to upload post videos")
            }
          },
          error: (error: HttpErrorResponse) => {
            resolve(false);
            console.error(error);
          }
        });
      } else {
        resolve(true);
      }
    });
  }


  onDeleteTag(tag: Tag) {
    this.selectedTagId = "";

    let isInDeletingList: boolean = tag.tagId != undefined &&
      this.tagsIdsToDelete.includes(tag.tagId!);

    let isOriginalTag: boolean = this.editingPost.tagPerPostList.find((tagPerPost: TagPerPost) => tagPerPost.tagId == tag.tagId) == undefined;

    // IF NOT IN POST TAGS TO DELETE AND NOT ORIGINAL TAG
    if (!isInDeletingList && !isOriginalTag) {
      console.log("removed from potential list")
      // REMOVE FROM TAG PER POST LIST
      this.editingPost.tagPerPostList.splice(this.editingPost.tagPerPostList
        .findIndex((tagPersonPost: TagPerPost) => tagPersonPost.tagId == tag.tagId), 1);
    }
    // IF NOT IN DELETING BUT ORIGINAL TAG PER POST
    else if (!isInDeletingList && tag.tagId != undefined) {
      // ADD TO POST IMAGES TO DELETE
      tag.mightDelete = true;
      this.tagsIdsToDelete.push(tag.tagId!);
    }
    // IF ALREADY IN DELETING AND ORIGINAL POST IMAGE
    else if (isInDeletingList && tag.tagId != undefined) {
      // REMOVE FROM POST IMAGES TO DELETE
      tag.mightDelete = false;
      this.tagsIdsToDelete.splice(this.tagsIdsToDelete
        .findIndex((tagId: number) => tagId === tag.tagId), 1);
    }
  }

  onDeleteImage(postImage: PostImage) {
    let isInDeletingList: boolean = postImage.postImageId != undefined &&
      this.postImagesIdsToDelete.includes(postImage.postImageId!);

    // IF NOT IN POST IMAGES TO DELETE AND NOT ORIGINAL POST IMAGE
    if (!isInDeletingList && postImage.postImageId == undefined) {
      console.log("removed from potential list")
      // REMOVE FROM POST IMAGES
      this.editingPost?.postImageList.splice(this.editingPost?.postImageList
        .findIndex((postImage1: PostImage) => postImage1.imageUrl == postImage.imageUrl), 1);

      // REMOVE FROM FILES
      let indexFiles = this.images.findIndex((file: File) => URL.createObjectURL(file) == postImage.imageUrl);
      this.images.splice(indexFiles, 1);
    }
    // IF NOT IN DELETING BUT ORIGINAL POST IMAGE
    else if (!isInDeletingList && postImage.postImageId != undefined) {
      // ADD TO POST IMAGES TO DELETE
      postImage.mightDelete = true;
      this.postImagesIdsToDelete.push(postImage.postImageId!);
    }
    // IF ALREADY IN DELETING AND ORIGINAL POST IMAGE
    else if (isInDeletingList && postImage.postImageId != undefined) {
      // REMOVE FROM POST IMAGES TO DELETE
      postImage.mightDelete = false;
      this.postImagesIdsToDelete.splice(this.postImagesIdsToDelete
        .findIndex((postImageId: number) => postImageId === postImage.postImageId), 1);
    }
  }

  onDeleteVideo(postVideo: PostVideo) {
    let isInDeletingList: boolean = postVideo.postVideoId != undefined &&
      this.postVideosIdsToDelete.includes(postVideo.postVideoId!);

    // IF NOT IN POST IMAGES TO DELETE AND NOT ORIGINAL POST IMAGE
    if (!isInDeletingList && postVideo.postVideoId == undefined) {
      console.log("removed from potential list")
      // REMOVE FROM POST IMAGES
      this.editingPost?.postVideoList.splice(this.editingPost?.postVideoList
        .findIndex((postVideo1: PostVideo) => postVideo1.videoUrl == postVideo.videoUrl), 1);

      // REMOVE FROM FILES
      let indexFiles = this.videos.findIndex((file: File) => URL.createObjectURL(file) == postVideo.videoUrl);
      this.videos.splice(indexFiles, 1);
    }
    // IF NOT IN DELETING BUT ORIGINAL POST IMAGE
    else if (!isInDeletingList && postVideo.postVideoId != undefined) {
      // ADD TO POST IMAGES TO DELETE
      postVideo.mightDelete = true;
      this.postVideosIdsToDelete.push(postVideo.postVideoId!);
    }
    // IF ALREADY IN DELETING AND ORIGINAL POST IMAGE
    else if (isInDeletingList && postVideo.postVideoId != undefined) {
      // REMOVE FROM POST IMAGES TO DELETE
      postVideo.mightDelete = false;
      this.postVideosIdsToDelete.splice(this.postVideosIdsToDelete
        .findIndex((postVideoId: number) => postVideoId === postVideo.postVideoId), 1);
    }
  }

  private resetValues() {
    if (this.modalOpenType == ModalOpenType.ADD) {
      this.editingPost = new Post("", "", "", this.currentMemberService.member?.getMemberId()!);
    }

    for (let i = this.editingPost.postImageList.length - 1; i >= 0; i--) {
      if (this.editingPost.postImageList[i].postImageId == undefined) {
        this.editingPost.postImageList.splice(i, 1);
        this.editingPost.postVideoList.splice(i, 1);
      } else if (this.editingPost.postImageList[i].mightDelete) {
        this.editingPost.postImageList[i].mightDelete = false;
        this.editingPost.postVideoList[i].mightDelete = false;
      }
    }

    this.images = [];
    this.videos = [];
    this.postImagesIdsToDelete = [];
    this.postVideosIdsToDelete = [];
    this.tagsIdsToDelete = [];
    this.selectedTagId = "";
  }

  override closeModal() {
    this.resetMessages();
    this.resetValues();
    super.closeModal();
  }

  isSuccess() {
    return this.isImagesSuccess && this.isVideosSuccess;
  }

  checkIfPostAdded() {
    if (this.isPostAdded) {
      this.resetMessages()
      this.isPostAdded = false;
    }
  }

  private resetMessages() {
    this.imagesStatusMsg = "";
    this.videosStatusMsg = "";
    this.isImagesSuccess = false;
    this.isVideosSuccess = false;
  }
}
