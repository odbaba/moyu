# flash.security Package - Advanced Security

Advanced security features beyond basic security sandbox concepts. Provides digital signatures, certificate validation, and XML signature verification.

## XMLSignatureValidator

Validates XML digital signatures according to W3C XML Signature standards.

**Constructor**: `XMLSignatureValidator()`

**Properties**:
- `validityStatus: String` (read-only): Validation result status.
- `dnsName: String` (read-only): DNS name from certificate.
- `identity: Object` (read-only): Certificate identity information.
- `signerCN: String` (read-only): Signer's Common Name from certificate.
- `signerDN: String` (read-only): Signer's Distinguished Name.
- `signerExtendedKeyUsages: Array` (read-only): Extended key usages.
- `signerTrustSettings: Array` (read-only): Trust settings for signer.

**Methods**:
- `verify(xml:XML, context:VerificationContext = null): void`: Verifies XML signature.
- `useSystemTrustStore: Boolean`: Whether to use OS certificate store.

**Validation Status Constants** (SignatureStatus):
- `VALID`: Signature is valid.
- `INVALID`: Signature is invalid.
- `UNKNOWN`: Cannot determine validity.

**Example**:

```as3
import flash.security.XMLSignatureValidator;

// XML with signature
var signedXML:XML = loadSignedXML();

var validator:XMLSignatureValidator = new XMLSignatureValidator();
validator.useSystemTrustStore = true;

validator.addEventListener(Event.COMPLETE, function(e:Event):void {
    trace("Validation complete");
    trace("Status: " + validator.validityStatus);
    
    if (validator.validityStatus == SignatureStatus.VALID) {
        trace("Signature is valid");
        trace("Signed by: " + validator.signerCN);
        trace("DNS Name: " + validator.dnsName);
        processSignedData(signedXML);
    } else {
        trace("Signature is invalid or unknown");
        rejectSignedData();
    }
});

validator.addEventListener(ErrorEvent.ERROR, function(e:ErrorEvent):void {
    trace("Validation error: " + e.text);
});

// Verify the signature
try {
    validator.verify(signedXML);
} catch (error:Error) {
    trace("Verification failed: " + error.message);
}
```

## CertificateStatus

Constants for certificate validation status.

**Constants**:
- `EXPIRED`: Certificate has expired.
- `INVALID`: Certificate is invalid.
- `INVALID_CHAIN`: Certificate chain is invalid.
- `NOT_YET_VALID`: Certificate not yet valid (date in future).
- `PRINCIPAL_MISMATCH`: Certificate principal doesn't match.
- `REVOKED`: Certificate has been revoked.
- `TRUSTED`: Certificate is trusted.
- `UNKNOWN`: Certificate status unknown.
- `UNTRUSTED_SIGNERS`: Certificate signed by untrusted signers.

## RevocationCheckSettings

Configuration for certificate revocation checking.

**Properties**:
- `preferredRevocationMode: String`: Preferred method for revocation checks.
- `useOnlineRevocationCheck: Boolean`: Whether to check online (OCSP/CRL).

**Revocation Modes**:
- `BEST_EFFORT`: Check if available, don't fail if unavailable.
- `REQUIRED_IF_AVAILABLE`: Check if available, fail if check fails.
- `REQUIRED`: Always check, fail if unavailable.
- `NEVER`: Never check revocation.

**Example**:

```as3
import flash.security.RevocationCheckSettings;

var settings:RevocationCheckSettings = new RevocationCheckSettings();
settings.preferredRevocationMode = RevocationCheckSettings.REQUIRED_IF_AVAILABLE;
settings.useOnlineRevocationCheck = true;

// Use with signature validation
var validator:XMLSignatureValidator = new XMLSignatureValidator();
validator.revocationCheckSettings = settings;
```

## IURIDereferencer

Interface for custom URI resolution in XML signatures.

**Method**:
- `dereference(uri:String): IDataInput`: Resolves a URI to data.

**Example - Custom URI Resolver**:

```as3
import flash.security.IURIDereferencer;

public class CustomURIDereferencer implements IURIDereferencer {
    public function dereference(uri:String):IDataInput {
        trace("Resolving URI: " + uri);
        
        if (uri.indexOf("http://") == 0) {
            // Load from HTTP
            var loader:URLLoader = new URLLoader();
            loader.load(new URLRequest(uri));
            return loader.data as ByteArray;
        } else if (uri.indexOf("file://") == 0) {
            // Load from file
            var file:File = new File(uri);
            var stream:FileStream = new FileStream();
            stream.open(file, FileMode.READ);
            var data:ByteArray = new ByteArray();
            stream.readBytes(data);
            stream.close();
            return data;
        } else {
            // Custom protocol
            return loadCustomResource(uri);
        }
    }
}

// Usage
var validator:XMLSignatureValidator = new XMLSignatureValidator();
validator.uriDereferencer = new CustomURIDereferencer();
```

## ReferencesValidationSetting

Controls which references in an XML signature must be validated.

**Constants**:
- `ALL_REFERENCES`: Validate all references in signature.
- `SIGNED_ONLY`: Validate only signed references.
- `VALIDATING_REFERENCES`: Validate only references being validated.

## Digital Signature Verification Flow

```as3
function verifyXMLSignature(signedData:XML):void {
    var validator:XMLSignatureValidator = new XMLSignatureValidator();
    
    // Configure validation
    validator.useSystemTrustStore = true;
    
    // Revocation checking
    var revSettings:RevocationCheckSettings = new RevocationCheckSettings();
    revSettings.preferredRevocationMode = RevocationCheckSettings.BEST_EFFORT;
    revSettings.useOnlineRevocationCheck = true;
    validator.revocationCheckSettings = revSettings;
    
    // Reference validation
    validator.referencesValidationSetting = ReferencesValidationSetting.ALL_REFERENCES;
    
    // Event handlers
    validator.addEventListener(Event.COMPLETE, function(e:Event):void {
        handleValidationResult(validator);
    });
    
    validator.addEventListener(ErrorEvent.ERROR, function(e:ErrorEvent):void {
        trace("Validation error: " + e.text);
        handleValidationError(e);
    });
    
    // Verify
    validator.verify(signedData);
}

function handleValidationResult(validator:XMLSignatureValidator):void {
    trace("=== Signature Validation Result ===");
    trace("Status: " + validator.validityStatus);
    
    switch (validator.validityStatus) {
        case SignatureStatus.VALID:
            trace("✓ Signature is VALID");
            trace("  Signer: " + validator.signerCN);
            trace("  Organization: " + validator.identity.organizationName);
            trace("  Email: " + validator.identity.emailAddress);
            
            // Check certificate status
            if (isCertificateTrusted(validator)) {
                processTrustedData();
            } else {
                warnUntrustedSigner();
            }
            break;
            
        case SignatureStatus.INVALID:
            trace("✗ Signature is INVALID");
            trace("  Possible tampering or incorrect signature");
            rejectData();
            break;
            
        case SignatureStatus.UNKNOWN:
            trace("? Signature validity UNKNOWN");
            trace("  Cannot verify - missing information");
            requestUserDecision();
            break;
    }
}

function isCertificateTrusted(validator:XMLSignatureValidator):Boolean {
    // Check trust settings
    var trustSettings:Array = validator.signerTrustSettings;
    for each (var setting:Object in trustSettings) {
        if (setting.trusted == false) {
            return false;
        }
    }
    return true;
}
```

## Certificate Information Extraction

```as3
function extractCertificateInfo(validator:XMLSignatureValidator):Object {
    var certInfo:Object = {
        commonName: validator.signerCN,
        distinguishedName: validator.signerDN,
        dnsName: validator.dnsName,
        identity: validator.identity,
        trustSettings: validator.signerTrustSettings,
        keyUsages: validator.signerExtendedKeyUsages
    };
    
    // Parse DN components
    var dnParts:Array = validator.signerDN.split(",");
    for each (var part:String in dnParts) {
        var keyValue:Array = part.split("=");
        if (keyValue.length == 2) {
            var key:String = keyValue[0].replace(/^\s+|\s+$/g, "");
            var value:String = keyValue[1].replace(/^\s+|\s+$/g, "");
            
            switch (key) {
                case "CN":
                    certInfo.cn = value;
                    break;
                case "O":
                    certInfo.organization = value;
                    break;
                case "OU":
                    certInfo.organizationalUnit = value;
                    break;
                case "C":
                    certInfo.country = value;
                    break;
            }
        }
    }
    
    return certInfo;
}
```

## Best Practices

### Signature Validation
- Always validate signatures before trusting signed data
- Use system trust store for production applications
- Implement proper error handling for validation failures
- Check certificate expiration and revocation status
- Log validation attempts for security auditing

### Certificate Trust
- Don't automatically trust all valid signatures
- Check certificate chains and trust anchors
- Verify certificate purpose matches usage
- Implement certificate pinning for critical operations
- Handle untrusted certificates appropriately

### Revocation Checking
- Enable online revocation checking when possible
- Use BEST_EFFORT mode for non-critical operations
- Cache revocation information to improve performance
- Handle network failures gracefully
- Log revocation check results

### Error Handling

```as3
function robustSignatureVerification(signedData:XML):void {
    var validator:XMLSignatureValidator = new XMLSignatureValidator();
    
    try {
        validator.addEventListener(Event.COMPLETE, onValidationComplete);
        validator.addEventListener(ErrorEvent.ERROR, onValidationError);
        validator.verify(signedData);
    } catch (securityError:SecurityError) {
        trace("Security error: " + securityError.message);
        handleSecurityError(securityError);
    } catch (error:Error) {
        trace("Unexpected error: " + error.message);
        handleUnexpectedError(error);
    }
}

function onValidationError(e:ErrorEvent):void {
    // Network errors, malformed signatures, etc.
    trace("Validation error: " + e.text);
    logSecurityEvent("Signature validation failed", e.text);
    notifyUser("Could not verify signature");
}
```

## Security Considerations

- Never skip signature validation for convenience
- Validate signatures before parsing signed content
- Use strong cryptographic algorithms
- Keep certificate trust stores up to date
- Implement defense in depth - don't rely solely on signatures
- Audit all signature validation operations
- Handle validation failures securely (fail closed)
- Be cautious with custom URI dereferencers
- Validate certificate chains completely
- Check for certificate revocation

## Common Use Cases

### Verifying Software Updates

```as3
function verifyUpdatePackage(updateXML:XML):Boolean {
    var validator:XMLSignatureValidator = new XMLSignatureValidator();
    var validationComplete:Boolean = false;
    var isValid:Boolean = false;
    
    validator.addEventListener(Event.COMPLETE, function():void {
        validationComplete = true;
        isValid = (validator.validityStatus == SignatureStatus.VALID);
    });
    
    validator.verify(updateXML);
    
    // Wait for async validation
    while (!validationComplete) {
        // In real code, use events properly
    }
    
    return isValid;
}
```

### Validating Configuration Files

```as3
function loadSignedConfig(configFile:File):Object {
    var stream:FileStream = new FileStream();
    stream.open(configFile, FileMode.READ);
    var xmlString:String = stream.readUTFBytes(stream.bytesAvailable);
    stream.close();
    
    var signedXML:XML = XML(xmlString);
    
    if (verifySignature(signedXML)) {
        return parseConfig(signedXML);
    } else {
        throw new Error("Configuration signature invalid");
    }
}
```

## See Also

- `flash.security.Security` - Security sandbox control
- `flash.crypto` - Cryptographic operations
- `XMLSignature W3C Standard` - XML Signature specification
- `X.509 Certificates` - Certificate format standard
- `OCSP/CRL` - Certificate revocation protocols
