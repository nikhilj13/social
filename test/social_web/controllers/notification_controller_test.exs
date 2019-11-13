defmodule SocialWeb.NotificationControllerTest do
  use SocialWeb.ConnCase

  alias Social.Notifications
  alias Social.Notifications.Notification

  @create_attrs %{
    date: ~D[2010-04-17],
    text: "some text",
    type: "some type"
  }
  @update_attrs %{
    date: ~D[2011-05-18],
    text: "some updated text",
    type: "some updated type"
  }
  @invalid_attrs %{date: nil, text: nil, type: nil}

  def fixture(:notification) do
    {:ok, notification} = Notifications.create_notification(@create_attrs)
    notification
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all notifications", %{conn: conn} do
      conn = get(conn, Routes.notification_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create notification" do
    test "renders notification when data is valid", %{conn: conn} do
      conn = post(conn, Routes.notification_path(conn, :create), notification: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.notification_path(conn, :show, id))

      assert %{
               "id" => id,
               "date" => "2010-04-17",
               "text" => "some text",
               "type" => "some type"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.notification_path(conn, :create), notification: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update notification" do
    setup [:create_notification]

    test "renders notification when data is valid", %{conn: conn, notification: %Notification{id: id} = notification} do
      conn = put(conn, Routes.notification_path(conn, :update, notification), notification: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.notification_path(conn, :show, id))

      assert %{
               "id" => id,
               "date" => "2011-05-18",
               "text" => "some updated text",
               "type" => "some updated type"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, notification: notification} do
      conn = put(conn, Routes.notification_path(conn, :update, notification), notification: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete notification" do
    setup [:create_notification]

    test "deletes chosen notification", %{conn: conn, notification: notification} do
      conn = delete(conn, Routes.notification_path(conn, :delete, notification))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.notification_path(conn, :show, notification))
      end
    end
  end

  defp create_notification(_) do
    notification = fixture(:notification)
    {:ok, notification: notification}
  end
end
