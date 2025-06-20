<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Your email address where messages will be sent
    $to = "your-email@example.com";

    // Collect and sanitize form data
    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $message = trim($_POST["message"]);

    // Basic validation
    if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Invalid input
        http_response_code(400);
        echo "Please complete the form correctly.";
        exit;
    }

    // Prepare the email content
    $subject = "New message from your website contact form";
    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n\n";
    $email_content .= "Message:\n$message\n";

    // Email headers
    $email_headers = "From: $name <$email>";

    // Send the email
    if (mail($to, $subject, $email_content, $email_headers)) {
        // Success message
        echo "Thank you! Your message has been sent.";
    } else {
        // Failure message
        http_response_code(500);
        echo "Oops! Something went wrong, and we couldn't send your message.";
    }
} else {
    // Not a POST request
    http_response_code(403);
    echo "There was a problem with your submission, please try again.";
}
?>
