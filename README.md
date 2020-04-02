![Imgur](https://imgur.com/4fiqYRr.png)

To use this component, you must first have a firebase account.

[Identify/register yourself on the firebase console](https://console.firebase.google.com/) and follow the instructions below.

## Configure Firebase console

Follow these instructions to create your application in the firebase interface. You'll need to obtain some information for the configuration of the component in the PandaSuite studio.

![Imgur](https://i.imgur.com/S3NxN2e.png)
![Imgur](https://imgur.com/vmx7suc.png)
![Imgur](https://imgur.com/k926Clx.png)

Now that the application is created, you need to enable login/password authentication.

![Imgur](https://imgur.com/ihBpOnJ.png)
![Imgur](https://imgur.com/Ng1G2ip.png)
![Imgur](https://imgur.com/54YauhM.png)

### Additional Steps for ```Advanced user fields``` component's option

This configuration is only required when using advanced fields. They are indeed stored in a specific firebase database that you have to create beforehand.

![Imgur](https://imgur.com/isIqAzt.png)
![Imgur](https://imgur.com/2WZPTSM.png)
![Imgur](https://imgur.com/a5cA69p.png)

Make sure to update the security rules so that you are not blocked after 30 days.

![Imgur](https://imgur.com/xJBTmGp.png)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // This rule allows anyone on the internet to view, edit, and delete
    // all data in your Firestore database. It is useful for getting
    // started, but it is configured to expire after 30 days because it
    // leaves your app open to attackers. At that time, all client
    // requests to your Firestore database will be denied.
    //
    // Make sure to write security rules for your app before that time, or else
    // your app will lose access to your Firestore database
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId
    }
  }
}
```
![Imgur](https://imgur.com/PjD4D5P.png)

## Configure PandaSuite component

You need to retrieve information from the Firebase console to update it to the PandaSuite component.

![Imgur](https://imgur.com/JIHnHli.png)
![Imgur](https://imgur.com/eAncOOW.png)

On PandaSuite:

![Imgur](https://imgur.com/0S7NOP5.png)

```Force authentification after (hours)``` is the number of hours after identification where the session remains valid (even without an internet connection). After this number of hours, an internet connection will be required to continue. If the session is still valid, he will not need to re-login. By default, the value of 0 creates an infinite session. 

```Force email verification``` is an additional step of email validation where the person receives an email with a validation web link. This step will be required before accessing the application.

```Advanced user fields``` are the addition of advanced fields to the user registration (position and company).

```Show communications and usage terms``` are the addition of a checkbox for the validation of the conditions of use. A new event is exposed (onTermsClicked) to display them in the studio.

### Traits

You can associate data with users as a trait from the studio. We use the PandaSuite concept of markers to do this.
They can be useful for a very large number of uses such as saving a progression or managing accesses.

The advantage is that the data can be modified outside the application by another system. You just have to use the [Firebase APIs](https://firebase.google.com/docs/reference). And it works in real time.

First start by adding a marker, it automatically creates a new trait.

![Imgur](https://imgur.com/yj7LGT2.png)

The name of the trait is important since it is used in the database storage. Be sure to rename it to match your usage. You can ignore the ID, it just has to be unique.

![Imgur](https://imgur.com/ATYke1H.png)

The checkboxes concern the triggering behavior of your marker. In our example, it will be triggered at its creation or at its intitialization. You need to add another one with the same trait name to manage deletion for example.

Action is also available on this marker. It corresponds to its triggering and/or suppression depending on its configuration.

![Imgur](https://imgur.com/UHo7qAO.png)

You can edit the data directly from the Firebase console to see the changes live.
