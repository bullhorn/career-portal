The second step in the deployment process is to upload the configured Bullhorn Career Portal release package to a website hosting service. The following guide walks through the process of uploading to an Amazon AWS S3 host:

***

**1. Create or sign into an Amazon AWS Account**

Hosting the Bullhorn Career Portal on Amazon AWS requires the use of the S3 bucket service. If you do not already have an Amazon AWS account, **[create one here](http://aws.amazon.com)**.

***

**2. Navigate to the S3 Bucket Service**

In the AWS Management Console, select the `S3` under the `Storage & Content Delivery` section:

![AWS management console](media/AWSControlPanel.png)

The S3 Management Console displays:

![S3 management console](media/S3ControlPanel.png)

***

**3. Create a new S3 bucket to store Bullhorn Career Portal content**

Select `Actions --> Create Bucket...` and provide a name and AWS region that most closely matches your company's location. Consider naming the bucket with the convention `[My Company Name]-careers` to identify it uniquely among other AWS S3 buckets. Click the `Create` button:

![create S3 bucket](media/CreateS3Bucket.png)

***

**4. Configure the S3 Bucket to serve HTML Content**

Make sure your bucket is selected in the `All Buckets` list view on the left side of the S3 Management Console. Open the `Properties` pane on the right side, if not already open, by clicking on the `Properties` button at top right. Expand the `Static Website Hosting` section, select the `Enable website hosting` option, and input `index.html` into the `Index Document` field. Finally, click the `Save` button in the `Static Website Hosting` section:

![host S3 content as a site](media/S3StaticSiteHost.png)

***

**5. Modify S3 Bucket Permissions for Internet Access**

In order for everyone to see the contents of your S3 bucket, read-only permissions must be granted to anonymous users. Reference **[Amazon's bucket policy pages](https://docs.aws.amazon.com/AmazonS3/latest/dev/example-bucket-policies.html#example-bucket-policies-use-case-2)** for full details.

The template policy for anonymous access looks like this (notice the `[ YOUR BUCKET NAME HERE ]` token):

`{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "AddPerm",
			"Effect": "Allow",
			"Principal": "*",
			"Action": "s3:GetObject",
			"Resource": "arn:aws:s3:::[ YOUR BUCKET NAME HERE ]/*"
		}
	]
}`

To set up the bucket policy, expand the `Permissions` section in the `Properties` pane of your selected bucket. Click the `Add bucket policy` button, and input the policy text above into the `Bucket Policy Editor` dialog that appears, **replacing** the `[ YOUR BUCKET NAME HERE ]` token with your bucket name. Click the `Save` button:

![S3 bucket policy](media/S3BucketPolicy.png)

***

**6. Upload Bullhorn Career Portal package to the S3 Bucket**

Click the newly created bucket in the `All Buckets` list on the S3 Management Console. The bucket contents display, with a `The bucket is empty` message. Click `Actions --> Upload`, then `Add Files` buttons. Navigate to the location of your extracted and configured Bullhorn Career Portal package from the `Download and Configure` step, and select the files to upload. You can upload multiple files at once. Click the `Start Upload` button:

![S3 file upload](media/S3FileUpload.png)

Repeat this process for each subfolder in the Bullhorn Career Portal package (each must be done seperately). When complete, the bucket should look similar this:

![S3 bucket](media/S3Bucket.png)

***

**7. Test your Bullhorn Career Portal**

Navigate back to the S3 Management Console by clicking the `All Buckets` link. Select the newly created bucket, open the `Properties` pane, expand the `Static Website Hosting` section and click on the `Endpoint` link. The S3 Management Console will open Bullhorn Career Portal in a new browser tab. Verify the portal is displaying jobs published via the Bullhorn ATS/CRM JobCast screen.

***

**8. Optional - Set up a custom domain name**

The URL which acts as the endpoint for your Amazon AWS S3 Career Portal is determined by the Amazon AWS S3 service, and can be cumbersome to type in. If you own your a custom domain name, for example acmerecruiters.com, you can modify your DNS entries to point a sub-domain, for example careers.acmerecruiters.com, to your Amazon AWS S3 Career Portal instead of using the default URL. For detailed instructions, see Amazon's **[Setting Up a Static Website Using a Custom Domain](https://docs.aws.amazon.com/AmazonS3/latest/dev/website-hosting-custom-domain-walkthrough.html)**.

***

**That's it!** Your configured Bullhorn Career Portal is uploaded and ready for use!



