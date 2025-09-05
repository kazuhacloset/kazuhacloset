from django.urls import path
from .views import (
    RegisterView, LoginView, UserProfileView, UpdateProfileView,
    AddToCartView, CartView, Remove_Item,
    SendOtpView, VerifyOtpView, CreateOrderView, VerifyPaymentView,
    OrderHistoryView,
    # New forgot password imports
    ForgotPasswordOtpView, VerifyForgotPasswordOtpView, ResetPasswordView,ContactSupportView
)

urlpatterns = [
    # Auth routes
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('updateprofile/', UpdateProfileView.as_view(), name='update-profile'),

    # Cart routes
    path('cart/add/', AddToCartView.as_view(), name='add-to-cart'),
    path('cart/', CartView.as_view(), name='get_cart'),
    path("cart/remove/<str:cart_key>/", Remove_Item.as_view(), name="remove_from_cart"),

    # OTP routes
    path('send-otp/', SendOtpView.as_view(), name='send-otp'),
    path('verify-otp/', VerifyOtpView.as_view(), name='verify-otp'),

    # Payment routes
    path("create-order/", CreateOrderView.as_view(), name="create-order"),
    path("verify-payment/", VerifyPaymentView.as_view(), name="verify-payment"),
    path("order-history/", OrderHistoryView.as_view(), name="order-history"),

    # Forgot Password OTP routes
    path("forgot-password/", ForgotPasswordOtpView.as_view(), name="forgot-password"),
    path("verify-forgot-otp/", VerifyForgotPasswordOtpView.as_view(), name="verify-forgot-otp"),
    path("reset-password/", ResetPasswordView.as_view(), name="reset-password"),
    path("contact/", ContactSupportView.as_view(), name="contact-support"),
]
