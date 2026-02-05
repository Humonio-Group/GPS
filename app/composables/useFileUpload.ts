export function useFileUpload() {
  const upload = (file: File, type: number, contentId?: number, courseId?: number) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", String(type));
    if (contentId) formData.append("content", String(contentId));
    if (courseId) formData.append("journey", String(courseId));

    return useApi().post("/files", { version: 2, endpointVersion: 1 }, {
      body: formData,
    }).catch((error) => {
      useLogger().error(error);
      // todo: toast it - loic
    });
  };

  return { upload };
}
